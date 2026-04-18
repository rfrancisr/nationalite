import fs from 'fs'
import path from 'path'
import pdfParse from 'pdf-parse'
import { createClient } from '@supabase/supabase-js'
import { parseQuestions, mapToCategory, CATEGORY_MAP } from '../src/utils/parse-pdf'

const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? ''
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY ?? ''

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY env vars')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

const CATEGORIES = [
  { slug: 'principles-of-american-democracy', name: 'Principles of American Democracy', icon: '📜' },
  { slug: 'system-of-government',             name: 'System of Government',             icon: '🏛️' },
  { slug: 'rights-and-responsibilities',      name: 'Rights and Responsibilities',      icon: '⚖️' },
  { slug: 'colonial-period-and-independence', name: 'Colonial Period & Independence',   icon: '🦅' },
  { slug: 'american-history-1800s',           name: 'American History — 1800s',         icon: '🎖️' },
  { slug: 'recent-american-history-and-world-war-ii', name: 'Recent History & WWII',   icon: '🌍' },
  { slug: 'other-american-history',           name: 'Other American History',           icon: '📚' },
  { slug: 'integrated-civics',                name: 'Integrated Civics',                icon: '🗺️' },
]

async function run() {
  // 1. Upsert categories
  console.log('Upserting categories…')
  const { error: catErr } = await supabase
    .from('categories')
    .upsert(CATEGORIES, { onConflict: 'slug' })
  if (catErr) throw catErr

  // 2. Fetch category id map
  const { data: cats, error: fetchErr } = await supabase
    .from('categories')
    .select('id, slug')
  if (fetchErr) throw fetchErr
  const categoryIdBySlug = Object.fromEntries(cats.map((c: { id: string; slug: string }) => [c.slug, c.id]))

  // 3. Parse PDF
  const questionsDir = path.resolve(process.cwd(), 'questions')
  const files = fs.readdirSync(questionsDir).filter((f) => f.endsWith('.pdf'))
  if (files.length === 0) throw new Error('No PDF found in questions/')
  const pdfBuffer = fs.readFileSync(path.join(questionsDir, files[0]))
  const { text } = await pdfParse(pdfBuffer)

  const parsed = parseQuestions(text)
  console.log(`Parsed ${parsed.length} questions from PDF`)

  if (parsed.length !== 128) {
    console.warn(`Warning: expected 128 questions, got ${parsed.length}`)
  }

  // 4. Upsert questions
  const rows = parsed.map((q) => ({
    number: q.number,
    category_id: categoryIdBySlug[mapToCategory(q.number)],
    question: q.question,
    answers: q.answers,
  }))

  const { error: qErr } = await supabase
    .from('questions')
    .upsert(rows, { onConflict: 'number' })
  if (qErr) throw qErr

  console.log(`✓ Seeded ${rows.length} questions successfully`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
