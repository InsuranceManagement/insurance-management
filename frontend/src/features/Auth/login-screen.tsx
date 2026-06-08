import { AuthCard } from "./components/auth-card"
import { AuthLayoutSplit } from "./components/auth-layout-split"
import LoginForm from "./components/login-form"

export default function LoginScreen() {
  return (
    <AuthLayoutSplit>
      <AuthCard
        title="Entrar"
        description="Acesse sua conta para gerenciar seus segurados."
      >
        <LoginForm />
      </AuthCard>
    </AuthLayoutSplit>
  )
}
