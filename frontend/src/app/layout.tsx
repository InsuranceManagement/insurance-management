import { QueryProvider } from "@/shared/components/QueryProvider/query-provider"
import { TooltipProvider } from "@/shared/components/ui/tooltip"
import { cn } from "@/shared/lib/utils"
import type { Metadata } from "next"
import { Geist, Geist_Mono, Inter } from "next/font/google"
import { Toaster } from "sonner"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Insurance Management",
  description: "Insurance operation and policy dashboard",
}

type RootLayoutProps = {
  children: React.ReactNode
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        inter.variable,
        "font-sans",
      )}
    >
      <body className="min-h-full">
        <QueryProvider>
          <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
        </QueryProvider>

        <Toaster
          position="top-right"
          richColors
          closeButton
        />
      </body>
    </html>
  )
}
