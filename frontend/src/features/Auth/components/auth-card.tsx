import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import { cn } from "@/shared/lib/utils"

interface AuthCardProps {
  title: string
  description?: string
  plainOnMobile?: boolean
  children: React.ReactNode
}

export function AuthCard({
  title,
  description,
  plainOnMobile = false,
  children,
}: AuthCardProps) {
  return (
    <Card
      className={cn(
        "w-full max-w-md",
        plainOnMobile &&
          "gap-4 rounded-none bg-transparent py-0 shadow-none ring-0 md:gap-6 md:rounded-xl md:bg-card md:py-6 md:shadow-xs md:ring-1",
      )}
    >
      <CardHeader className={cn("gap-2", plainOnMobile && "px-0 md:px-6")}>
        <CardTitle className="text-2xl">{title}</CardTitle>

        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>

      <CardContent className={cn(plainOnMobile && "px-0 md:px-6")}>
        {children}
      </CardContent>
    </Card>
  )
}
