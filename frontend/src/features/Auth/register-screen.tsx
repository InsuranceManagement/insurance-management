import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"

import { BrandPanel } from "./components/brand-panel"
import RegisterForm from "./components/register-form"

export default function RegisterScreen() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <BrandPanel />

      <div className="flex items-center justify-center bg-background p-6 lg:p-12">
        <Card className="w-full max-w-md">
          <CardHeader className="gap-2">
            <CardTitle className="text-2xl">Criar conta</CardTitle>

            <CardDescription>
              Cadastre um novo usuário no sistema.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <RegisterForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
