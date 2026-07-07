const Post = require('../models/post')

exports.getPosts = (req, res, next) => {
  // Sequelize używa findAll() zamiast find()
  Post.findAll()
    .then((posts) => {
      res.status(200).json({
        posts: posts,
      })
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({ message: 'Błąd pobierania postów' })
    })
}

exports.getPost = (req, res, next) => {
  const country = req.params.country
  // Sequelize używa findOne() by znaleźć jeden rekord po country
  Post.findOne({ where: { country: country } })
    .then((post) => {
      if (!post) {
        return res.status(404).json({ message: 'Nie znaleziono posta' })
      }
      res.status(200).json({
        post: post,
      })
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({ message: 'Błąd pobierania posta' })
    })
}

exports.getPostsByContinent = (req, res, next) => {
  const continent = req.params.continent
  // W Sequelize filtrowanie robimy w obiekcie 'where'
  Post.findAll({ where: { continent: continent } })
    .then((posts) => {
      res.status(200).json({
        posts: posts,
      })
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({ message: 'Błąd filtrowania' })
    })
}

exports.createPost = (req, res, next) => {
  // Wyciągamy dane z req.body - dobra praktyka to destrukturyzacja
  const {
    title,
    subtitle,
    country,
    continent,
    tourStart,
    tourEnd,
    imageUrl,
    textLead,
    textParagraphs, // Oczekujemy tablicy obiektów: [{ paragraphLead, paragraphText }]
    postGallery, // Oczekujemy tablicy tablic: [[{ src }]]
    creator,
    author,
    modifiedAt,
  } = req.body

  Post.create({
    title,
    subtitle,
    country,
    continent,
    tourStart,
    tourEnd,
    imageUrl,
    textLead,
    textParagraphs,
    postGallery, // Dodane nowe pole
    creator,
    author,
    modifiedAt,
  })
    .then((result) => {
      res.status(201).json({
        message: 'Post created!',
        post: result,
      })
    })
    .catch((err) => {
      console.error('Sequelize Error:', err)

      // Obsługa błędu 22P02, o którym wspomniałeś wcześniej
      if (err.parent && err.parent.code === '22P02') {
        return res.status(400).json({
          message: 'Błąd formatu danych. Upewnij się, że baza danych została zaktualizowana do JSONB.',
          error: err.parent.detail,
        })
      }

      res.status(500).json({
        message: 'Błąd tworzenia posta',
        error: err.message || err,
      })
    })
}

// const Post = require('../models/post')

// exports.getPosts = (req, res, next) => {
//   Post.find()
//     .then((posts) => {
//       res.status(200).json({
//         posts: posts,
//       })
//     })
//     .catch((err) => console.log(err))
// }

// exports.getPost = (req, res, next) => {
//   const postId = req.params.postId
//   Post.findById(postId)
//     .then((post) => {
//       res.status(200).json({
//         post: post,
//       })
//     })
//     .catch((err) => console.log(err))
// }

// exports.getPostsByContinent = (req, res, next) => {
//   const continent = req.params.continent
//   Post.find({ continent: continent })
//     .then((posts) => {
//       res.status(200).json({
//         posts: posts,
//       })
//     })
//     .catch((err) => console.log(err))
// }

// exports.createPost = (req, res, next) => {
//   const post = new Post({
//     title: req.body.title,
//     country: req.body.country,
//     continent: req.body.continent,
//     tourStart: req.body.tourStart,
//     tourEnd: req.body.tourEnd,
//     imageUrl: req.body.imageUrl,
//     textLead: req.body.textLead,
//     textParagraphs: req.body.textParagraphs,
//     creator: req.body.creator,
//     author: req.body.author,
//     modifiedAt: req.body.modifiedAt,
//   })

//   post
//     .save()
//     .then((result) => {
//       res.status(201).json({
//         message: 'Post created!',
//         post: result,
//       })
//     })
//     .catch((err) => console.log(err))
// }
