export type Kpi = {
  id: string
  title: string
  subtitle: string
  valueUrl: string
  queryParams?: Record<string, string>
  unit?: string
  prefix?: string
}
