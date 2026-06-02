import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"

import LoginForm from "./components/login-form"

export default function LoginScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Entrar</CardTitle>
        </CardHeader>

        <CardContent id="login-form">
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  )
}
