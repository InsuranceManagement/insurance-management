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
      <SidebarProvider data-right-panel-frame>
        <AppSidebar />
        <SidebarInset className="md:m-2 md:overflow-hidden md:rounded-xl md:shadow-sm">
          <AppHeader />
          <Box className="flex-1 flex-col">{children}</Box>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  )
}
