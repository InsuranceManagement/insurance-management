import { AuthCard } from "./components/auth-card"
import { AuthLayoutSplit } from "./components/auth-layout-split"
import RegisterForm from "./components/register-form"

export default function RegisterScreen() {
  return (
    <AuthLayoutSplit>
      <AuthCard
        title="Criar conta"
        description="Cadastre um novo usuário no sistema."
      >
        <RegisterForm />
      </AuthCard>
    </AuthLayoutSplit>
  )
}
