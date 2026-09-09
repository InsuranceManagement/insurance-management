import axios, { type AxiosRequestConfig } from "axios"

import { environment } from "@/shared/config/environment"
import { routes, type ApiRouteType } from "@/shared/constants/routes"

type QueryParamValue = string | number | boolean | null | undefined

export type ApiQueryParams = Record<string, QueryParamValue>
export type ApiRequestHeaders = AxiosRequestConfig["headers"]

type CsrfResponse = {
  csrfToken: string
}

let csrfToken: string | undefined

export function resetCsrfToken(): void {
  csrfToken = undefined
}

type ApiRequestOptions<TBody = unknown> = {
  route: ApiRouteType
  routeParams?: unknown[]
  queryParams?: ApiQueryParams
  headers?: ApiRequestHeaders
  body?: TBody
  signal?: AbortSignal
}

function resolvePath(route: ApiRouteType, routeParams: unknown[] = []) {
  if (typeof route.path === "function") {
    return route.path(...routeParams)
  }

  return route.path
}

export const axiosClient = axios.create({
  baseURL: environment.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

axiosClient.interceptors.request.use(
  async (config) => {
    config.withCredentials = true

    if (
      typeof window !== "undefined" &&
      ["POST", "PUT", "PATCH", "DELETE"].includes((config.method ?? "GET").toUpperCase())
    ) {
      if (!csrfToken) {
        const response = await axiosClient.get(resolvePath(routes.users.csrf), {
          withCredentials: true,
        })
        csrfToken = (response.data as CsrfResponse).csrfToken
      }

      if (csrfToken) {
        config.headers["X-CSRF-Token"] = csrfToken
      }
    }

    return config
  },
  (error) => Promise.reject(error),
)

export async function apiClient<TResponse, TBody = unknown>({
  route,
  routeParams,
  queryParams,
  headers,
  body,
  signal,
}: Readonly<ApiRequestOptions<TBody>>): Promise<TResponse> {
  const path = resolvePath(route, routeParams)

  const response = await axiosClient.request<TResponse>({
    url: path,
    method: route.method,
    headers,
    params: queryParams,
    data: body,
    signal,
  })

  return response.data
}
