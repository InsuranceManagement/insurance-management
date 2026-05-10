import dayjs from "dayjs"

export function formatDate(
  dateValue: string | Date,
  dayjsFormat: string,
  fallback = "-",
) {
  const parsedDate = dayjs(dateValue)
  if (!parsedDate.isValid()) {
    return fallback
  }

  return parsedDate.format(dayjsFormat)
}
