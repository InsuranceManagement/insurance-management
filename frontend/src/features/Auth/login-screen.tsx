import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"

import { BrandPanel } from "./components/brand-panel"
import LoginForm from "./components/login-form"

export default function LoginScreen() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <BrandPanel />

      <div className="flex items-center justify-center bg-background p-6 lg:p-12">
        <Card className="w-full max-w-md">
          <CardHeader className="gap-2">
            <CardTitle className="text-2xl">Entrar</CardTitle>

            <CardDescription>
              Acesse sua conta para gerenciar seus segurados.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
