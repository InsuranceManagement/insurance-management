import { AppHeader } from "@/shared/components/AppHeader/app-header"
import { AppSidebar } from "@/shared/components/AppSidebar/app-sidebar"
import { AuthGuard } from "@/shared/components/AuthGuard/auth-guard"
import { Box } from "@/shared/components/ui/box"
import { SidebarInset, SidebarProvider } from "@/shared/components/ui/sidebar"
import type { Metadata } from "next"
import "../globals.css"

export const metadata: Metadata = {
  title: "Insurance Management",
  description: "Insurance operation and policy dashboard",
}

type RootLayoutProps = {
  children: React.ReactNode
}

export default function RootLayout(props: Readonly<RootLayoutProps>) {
  const { children } = props

  return (
    <AuthGuard>
      <SidebarProvider data-right-panel-frame className="overflow-x-hidden">
        <AppSidebar />
        <SidebarInset className="min-w-0 overflow-x-hidden lg:m-2 lg:rounded-xl lg:shadow-sm">
          <AppHeader />
          <Box className="min-w-0 flex-1 flex-col">{children}</Box>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  )
}
