export function escapeString(value: unknown): string {
  if (value === null || value === undefined) {
    return ''
  }
  return String(value).replace(/[\\"]/g, '\\$&')
}
