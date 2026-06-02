import { AppHeader } from "@/shared/components/AppHeader/app-header"
import { AppSidebar } from "@/shared/components/AppSidebar/app-sidebar"
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
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <Box className="flex-1 flex-col">{children}</Box>
      </SidebarInset>
    </SidebarProvider>
  )
}
