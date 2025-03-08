/**
 * Formats a description string as a JSDoc comment.
 * Single line descriptions are formatted as: /**description* /
 * Multi-line descriptions are formatted with proper JSDoc structure.
 */
export function formatJsDoc(description: string): string {
  if (!description) {
    return '/**/\n'
  }

  const lines = description.split('\n')

  // For single line descriptions
  if (lines.length === 1) {
    return `/**${description}*/\n`
  }

  // For multi-line descriptions
  const formattedLines = lines.map((line) => ` * ${line || ' '}`)
  return `/**\n${formattedLines.join('\n')}\n */\n`
}
