const CITATION_PATTERN = /\(([^()#]+#chunk_\d+),\s*(\d{4}-\d{2}-\d{2})\)/g

export type ParsedCitation = {
  id: string
  date: string
  raw: string
}

export function extractCitations(content: string): ParsedCitation[] {
  const seen = new Set<string>()
  const citations: ParsedCitation[] = []

  for (const match of content.matchAll(CITATION_PATTERN)) {
    const raw = match[0]
    const id = match[1]
    const date = match[2]
    const key = `${id}|${date}`
    if (!seen.has(key)) {
      seen.add(key)
      citations.push({ id, date, raw })
    }
  }

  return citations
}

export function extractToolMentions(content: string): string[] {
  const lines = content.split('\n')
  return lines.filter(
    (line) =>
      /kb\.(search_chunks|get_document)/i.test(line) ||
      /\[tool/i.test(line),
  )
}
