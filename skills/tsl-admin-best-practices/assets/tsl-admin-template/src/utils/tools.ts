export function formatDate(value?: string | number | Date | null) {
  if (!value) return '-'
  return String(value)
}
