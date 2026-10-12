CREATE TABLE IF NOT EXISTS post_translations (
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  language CHAR(2) NOT NULL CHECK (language IN ('EN', 'PL')),
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL DEFAULT '',
  country_label TEXT NOT NULL,
  text_lead TEXT NOT NULL DEFAULT '',
  text_paragraphs JSONB NOT NULL DEFAULT '[]'::jsonb,
  metadata JSONB,
  hero JSONB,
  PRIMARY KEY (post_id, language)
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'post_translations_language_check'
      AND conrelid = 'post_translations'::regclass
  ) THEN
    ALTER TABLE post_translations
      ADD CONSTRAINT post_translations_language_check CHECK (language IN ('EN', 'PL'));
  END IF;
END $$;

-- Seed both languages from the legacy copy; replace the PL rows with translations before publishing.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = current_schema()
      AND table_name = 'posts'
      AND column_name = 'title'
  ) THEN
    EXECUTE $backfill$
      INSERT INTO post_translations (
        post_id,
        language,
        title,
        subtitle,
        country_label,
        text_lead,
        text_paragraphs,
        metadata,
        hero
      )
      SELECT
        posts.id,
        languages.language,
        posts.title,
        COALESCE(posts.subtitle, ''),
        posts.country,
        COALESCE(posts.text_lead, ''),
        COALESCE(posts.text_paragraphs, '[]'::jsonb),
        posts.metadata,
        posts.hero
      FROM posts
      CROSS JOIN (VALUES ('EN'::char(2)), ('PL'::char(2))) AS languages(language)
      ON CONFLICT (post_id, language) DO NOTHING
    $backfill$;
  END IF;
END $$;

ALTER TABLE posts
  DROP COLUMN IF EXISTS title,
  DROP COLUMN IF EXISTS subtitle,
  DROP COLUMN IF EXISTS text_lead,
  DROP COLUMN IF EXISTS text_paragraphs,
  DROP COLUMN IF EXISTS metadata,
  DROP COLUMN IF EXISTS hero;