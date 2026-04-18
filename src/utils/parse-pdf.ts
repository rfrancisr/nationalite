import type { ParsedQuestion } from '@/types'

/**
 * Maps category slugs to the question numbers that belong to them.
 * Source: official USCIS 128-question civics test groupings.
 */
export const CATEGORY_MAP: Record<string, number[]> = {
  'principles-of-american-democracy': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  'system-of-government': [
    13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
    31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48,
    49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66,
    67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77,
  ],
  'rights-and-responsibilities': [
    78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95,
    96, 97, 98, 99, 100,
  ],
  'colonial-period-and-independence': [101, 102, 103, 104, 105, 106, 107, 108],
  'american-history-1800s': [109, 110, 111, 112, 113],
  'recent-american-history-and-world-war-ii': [114, 115, 116, 117, 118],
  'other-american-history': [119, 120, 121, 122, 123, 124],
  'integrated-civics': [125, 126, 127, 128],
}

/** Returns the category slug for a given question number. */
export function mapToCategory(number: number): string {
  if (number < 1 || number > 128) {
    throw new RangeError(`Question number must be between 1 and 128, got ${number}`)
  }
  for (const [slug, nums] of Object.entries(CATEGORY_MAP)) {
    if (nums.includes(number)) return slug
  }
  throw new Error(`No category found for question ${number}`)
}

/**
 * Parses the raw text extracted from the USCIS civics PDF into structured
 * question objects. Questions start with "<number>." and answers are bullet
 * lines beginning with "▪" (or "•" or "-" as fallback).
 */
export function parseQuestions(raw: string): ParsedQuestion[] {
  const results: ParsedQuestion[] = []
  if (!raw.trim()) return results

  // Split into lines, discard blanks
  const lines = raw.split('\n').map((l) => l.trim()).filter(Boolean)

  const questionRegex = /^(\d+)\.\s+(.+)$/
  const answerRegex = /^[▪•\-]\s*(.+)$/

  let current: ParsedQuestion | null = null

  for (const line of lines) {
    const qMatch = questionRegex.exec(line)
    if (qMatch) {
      if (current) results.push(current)
      current = { number: parseInt(qMatch[1], 10), question: qMatch[2].trim(), answers: [] }
      continue
    }
    const aMatch = answerRegex.exec(line)
    if (aMatch && current) {
      current.answers.push(aMatch[1].trim())
    }
  }
  if (current) results.push(current)

  return results
}
