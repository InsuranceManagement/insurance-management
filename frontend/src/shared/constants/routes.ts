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
  productTypes: {
    list: {
      method: "GET",
      path: "/product-types",
    },
    create: {
      method: "POST",
      path: "/product-types",
    },
    getById: {
      method: "GET",
      path: (id: string) => `/product-types/${id}`,
    },
    updateById: {
      method: "PATCH",
      path: (id: string) => `/product-types/${id}`,
    },
    deleteById: {
      method: "DELETE",
      path: (id: string) => `/product-types/${id}`,
    },
  },
  products: {
    list: {
      method: "GET",
      path: "/products",
    },
    create: {
      method: "POST",
      path: "/products",
    },
    getById: {
      method: "GET",
      path: (id: string) => `/products/${id}`,
    },
    updateById: {
      method: "PATCH",
      path: (id: string) => `/products/${id}`,
    },
    deleteById: {
      method: "DELETE",
      path: (id: string) => `/products/${id}`,
    },
  },
} as const
