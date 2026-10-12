const Post = require('../models/post')
const PostTranslation = require('../models/postTranslation')
const sequelize = require('../util/database')

const translationFields = [
  'language',
  'title',
  'subtitle',
  'countryLabel',
  'textLead',
  'textParagraphs',
  'metadata',
  'hero',
]

const getLanguage = (req, res) => {
  const language = req.query.lang === undefined ? 'EN' : req.query.lang
  const normalizedLanguage = typeof language === 'string' ? language.toUpperCase() : ''

  if (!['EN', 'PL'].includes(normalizedLanguage)) {
    res.status(400).json({ message: 'Parametr lang musi mieć wartość EN albo PL' })
    return null
  }

  return normalizedLanguage
}

const translationInclude = (language) => ({
  model: PostTranslation,
  as: 'translations',
  attributes: translationFields,
  where: { language },
  required: true,
})

const serializePost = (post) => {
  const postData = post.toJSON()
  const translation = postData.translations[0]

  delete postData.translations
  return { ...postData, ...translation }
}

const isValidParagraphs = (paragraphs) =>
  Array.isArray(paragraphs) &&
  paragraphs.every(
    (paragraph) =>
      paragraph &&
      typeof paragraph.paragraphLead === 'string' &&
      Array.isArray(paragraph.paragraphText) &&
      paragraph.paragraphText.every((text) => typeof text === 'string'),
  )

exports.getPosts = (req, res, next) => {
  const language = getLanguage(req, res)
  if (!language) return

  Post.findAll({ include: [translationInclude(language)] })
    .then((posts) => {
      res.status(200).json({
        posts: posts.map(serializePost),
      })
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({ message: 'Błąd pobierania postów' })
    })
}

exports.getPost = (req, res, next) => {
  const language = getLanguage(req, res)
  if (!language) return

  const country = req.params.country
  Post.findOne({
    where: { country },
    include: [translationInclude(language)],
  })
    .then((post) => {
      if (!post) {
        return res.status(404).json({ message: 'Nie znaleziono posta' })
      }
      res.status(200).json({
        post: serializePost(post),
      })
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({ message: 'Błąd pobierania posta' })
    })
}

exports.getPostsByContinent = (req, res, next) => {
  const language = getLanguage(req, res)
  if (!language) return

  const continent = req.params.continent
  Post.findAll({
    where: { continent },
    include: [translationInclude(language)],
  })
    .then((posts) => {
      res.status(200).json({
        posts: posts.map(serializePost),
      })
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({ message: 'Błąd filtrowania' })
    })
}

exports.getCountriesByContinent = (req, res, next) => {
  const language = getLanguage(req, res)
  if (!language) return

  const continent = req.params.continent

  Post.findAll({
    attributes: ['country'],
    where: { continent: continent },
    include: [
      {
        ...translationInclude(language),
        attributes: ['countryLabel'],
      },
    ],
    order: [['country', 'ASC']],
  })
    .then((posts) => {
      const countriesByCode = new Map()
      posts.forEach((post) => {
        const country = post.toJSON()
        if (!countriesByCode.has(country.country)) {
          countriesByCode.set(country.country, {
            code: country.country,
            label: country.translations[0].countryLabel,
          })
        }
      })

      res.status(200).json({
        continent: continent,
        countries: [...countriesByCode.values()],
      })
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({ message: 'Błąd pobierania krajów' })
    })
}

exports.createPost = (req, res, next) => {
  const {
    country,
    continent,
    tourStart,
    tourEnd,
    imageUrl,
    postGallery,
    creator,
    author,
    modifiedAt,
    translations,
  } = req.body

  const supportedLanguages = ['EN', 'PL']
  if (
    !translations ||
    supportedLanguages.some((language) => {
      const translation = translations[language]
      return (
        !translation ||
        typeof translation.title !== 'string' ||
        !translation.title.trim() ||
        typeof translation.countryLabel !== 'string' ||
        !translation.countryLabel.trim() ||
        (translation.subtitle !== undefined && typeof translation.subtitle !== 'string') ||
        (translation.textLead !== undefined && typeof translation.textLead !== 'string') ||
        !isValidParagraphs(translation.textParagraphs || [])
      )
    })
  ) {
    return res.status(400).json({
      message: 'Wymagane są tłumaczenia EN i PL z polami title oraz countryLabel',
    })
  }

  sequelize
    .transaction(async (transaction) => {
      const post = await Post.create(
        {
          country,
          continent,
          tourStart,
          tourEnd,
          imageUrl,
          postGallery,
          creator,
          author,
          modifiedAt,
        },
        { transaction },
      )

      await PostTranslation.bulkCreate(
        supportedLanguages.map((language) => {
          const translation = translations[language]
          return {
            postId: post.id,
            language,
            title: translation.title,
            subtitle: translation.subtitle || '',
            countryLabel: translation.countryLabel,
            textLead: translation.textLead || '',
            textParagraphs: translation.textParagraphs || [],
            metadata: translation.metadata ?? null,
            hero: translation.hero ?? null,
          }
        }),
        { transaction },
      )

      return post
    })
    .then((post) => {
      res.status(201).json({
        message: 'Post created!',
        post: post,
      })
    })
    .catch((err) => {
      console.error('Sequelize Error:', err)
      res.status(500).json({
        message: 'Błąd tworzenia posta',
        error: err.message || err,
      })
    })
}

