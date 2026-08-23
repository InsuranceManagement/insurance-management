// O MS de notificações (branch features/template) exige as 7 chaves presentes no PUT
// mesmo que o valor seja null — não aceita omitir campos (ver relatório de bug).
// Por isso esse input espelha esse contrato: nenhum campo é opcional, todos aceitam null.
export interface UpdateTemplateInput {
  name: string | null
  description: string | null
  subject: string | null
  body: string | null
  variableSchema: Record<string, string> | null
  isActive: boolean | null
  notificationTypeId: string | null
}
