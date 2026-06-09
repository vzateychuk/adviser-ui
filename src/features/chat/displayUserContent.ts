/** First chat turn stores an expanded prompt; show only the patient question in UI. */
export function displayUserContent(content: string): string {
  const marker = '## Patient Request'
  const idx = content.indexOf(marker)
  if (idx === -1) return content

  const afterMarker = content.slice(idx + marker.length).trim()
  const nextSection = afterMarker.search(/\n## /)
  return nextSection === -1 ? afterMarker : afterMarker.slice(0, nextSection).trim()
}
