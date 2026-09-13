"use client"

import { useMemo, useState } from "react"

import {
  getStatusLabel,
  getTypeLabel,
  type NotificationLog,
} from "@/features/ApplicationLogs/models/notification-log"
import { routes } from "@/shared/constants/routes"
import { useApiQuery } from "@/shared/hooks/use-api-query"

const PAGE_SIZE = 10
const emptyLogs: NotificationLog[] = []
const initialFilters = { search: "", status: "", type: "", errorsOnly: false }

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
}

export function useApplicationLogs() {
  const query = useApiQuery<NotificationLog[]>({
    route: routes.notifications.logs,
  })
  const [filters, setFilters] = useState(initialFilters)
  const [page, setPage] = useState(1)
  const logs = query.data ?? emptyLogs

  const sortedLogs = useMemo(
    () =>
      [...logs].sort((a, b) => {
        const first = Date.parse(a.timestamp) || 0
        const second = Date.parse(b.timestamp) || 0
        return second - first
      }),
    [logs],
  )

  const statuses = useMemo(
    () =>
      Array.from(
        new Map(
          logs.map((log) => [log.notificationStatusId, getStatusLabel(log)]),
        ).entries(),
      ).map(([value, label]) => ({ value, label })),
    [logs],
  )

  const types = useMemo(
    () =>
      Array.from(
        new Map(
          logs.map((log) => [log.notificationTypeId, getTypeLabel(log)]),
        ).entries(),
      ).map(([value, label]) => ({ value, label })),
    [logs],
  )

  const filteredLogs = useMemo(() => {
    const search = normalize(filters.search.trim())
    return sortedLogs.filter((log) => {
      if (filters.status && log.notificationStatusId !== filters.status)
        return false
      if (filters.type && log.notificationTypeId !== filters.type) return false
      if (filters.errorsOnly && !log.errorMessage) return false
      if (!search) return true
      return [
        log.recipient,
        log.sentBy,
        log.body,
        log.errorMessage ?? "",
        log.id,
        getStatusLabel(log),
        getTypeLabel(log),
      ].some((value) => normalize(value).includes(search))
    })
  }, [sortedLogs, filters])

  const pageCount = Math.max(1, Math.ceil(filteredLogs.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const startIndex = (currentPage - 1) * PAGE_SIZE

  function updateFilters(next: Partial<typeof initialFilters>) {
    setFilters((current) => ({ ...current, ...next }))
    setPage(1)
  }

  function clearFilters() {
    setFilters(initialFilters)
    setPage(1)
  }

  return {
    query,
    filters,
    updateFilters,
    clearFilters,
    hasFilters: Boolean(
      filters.search || filters.status || filters.type || filters.errorsOnly,
    ),
    statuses,
    types,
    total: logs.length,
    errorCount: logs.filter((log) => Boolean(log.errorMessage)).length,
    filteredCount: filteredLogs.length,
    visibleLogs: filteredLogs.slice(startIndex, startIndex + PAGE_SIZE),
    currentPage,
    pageCount,
    startIndex,
    setPage,
  }
}
