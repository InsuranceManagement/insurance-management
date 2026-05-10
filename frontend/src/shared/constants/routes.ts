export type ApiRouteType = {
  method: "GET" | "POST" | "PATCH" | "DELETE"
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  path: string | ((...args: any[]) => string)
}

export const routes: Record<string, Record<string, ApiRouteType>> = {
  users: {
    list: {
      method: "GET",
      path: "/users",
    },
    create: {
      method: "POST",
      path: "/users",
    },
    login: {
      method: "POST",
      path: "/users/login",
    },
    getById: {
      method: "GET",
      path: (id: string) => `/users/${id}`,
    },
    updateById: {
      method: "PATCH",
      path: (id: string) => `/users/${id}`,
    },
    deleteById: {
      method: "DELETE",
      path: (id: string) => `/users/${id}`,
    },
  },
  insuranceCompanies: {
    list: {
      method: "GET",
      path: "/insurance-companies",
    },
    create: {
      method: "POST",
      path: "/insurance-companies",
    },
    getById: {
      method: "GET",
      path: (id: string) => `/insurance-companies/${id}`,
    },
    updateById: {
      method: "PATCH",
      path: (id: string) => `/insurance-companies/${id}`,
    },
    deleteById: {
      method: "DELETE",
      path: (id: string) => `/insurance-companies/${id}`,
    },
  },
} as const
