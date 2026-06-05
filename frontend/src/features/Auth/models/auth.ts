export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  accessToken: string

  user: {
    id: string
    name: string
    email: string
  }
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

//forgot and reset password

export interface ForgotPasswordRequest {
  email: string
}

export interface ForgotPasswordResponse {
  message: string
}

export interface ResetPasswordRequest {
  token: string
  password: string
}

export interface ResetPasswordResponse {
  message: string
}
