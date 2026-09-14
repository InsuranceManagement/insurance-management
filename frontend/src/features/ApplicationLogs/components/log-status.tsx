import { CircleAlertIcon } from "lucide-react"

import {
  getStatusLabel,
  type NotificationLog,
} from "@/features/ApplicationLogs/models/notification-log"
import { Typography } from "@/shared/components/ui/typography"
import { cn } from "@/shared/lib/utils"

export function LogStatus({ log }: Readonly<{ log: NotificationLog }>) {
  return (
    <Typography
      asChild
      variant="small"
      className={cn(
        "inline-flex max-w-full items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-xs text-sky-800 dark:border-sky-800 dark:bg-sky-950/50 dark:text-sky-200",
        log.errorMessage &&
          "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200",
      )}
    >
      <span>
        {log.errorMessage ? (
          <CircleAlertIcon aria-hidden="true" className="size-3.5 shrink-0" />
        ) : (
          <span
            aria-hidden="true"
            className="size-1.5 shrink-0 rounded-full bg-current"
          />
        )}
        <span className="truncate">{getStatusLabel(log)}</span>
      </span>
    </Typography>
  )
}
