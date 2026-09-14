type NotificationRelation = {
  id: string
  name: string
}

const statusLabels: Record<string, string> = {
  sent: "Enviada",
  delivered: "Entregue",
  failed: "Falhou",
  error: "Falhou",
  pending: "Pendente",
  queued: "Na fila",
  processing: "Processando",
  canceled: "Cancelada",
  cancelled: "Cancelada",
  bounced: "Rejeitada",
  opened: "Aberta",
  read: "Lida",
  success: "Enviada",
  succeeded: "Enviada",
}

const typeLabels: Record<string, string> = {
  email: "E-mail",
  sms: "SMS",
  whatsapp: "WhatsApp",
  push: "Notifica\u00E7\u00E3o push",
}

function normalizeLabel(value: string) {
  return value
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
}

export type NotificationLog = {
  id: string
  recipient: string
  sentBy: string
  body: string
  errorMessage: string | null
  timestamp: string
  notificationStatusId: string
  notificationStatus: NotificationRelation | null
  notificationTypeId: string
  notificationType: NotificationRelation | null
}

export function getStatusLabel(log: NotificationLog) {
  if (log.errorMessage) return "Falhou"

  const value = log.notificationStatus?.name || log.notificationStatusId
  if (!value) return "N\u00E3o informado"

  return statusLabels[normalizeLabel(value)] || value
}

export function getTypeLabel(log: NotificationLog) {
  const value = log.notificationType?.name || log.notificationTypeId
  if (!value) return "N\u00E3o informado"

  return typeLabels[normalizeLabel(value)] || value
}
