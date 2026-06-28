"use client"

import {
  CircleDollarSignIcon,
  HomeIcon,
  LogOutIcon,
  PackageIcon,
  TagsIcon,
  UsersIcon,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

import logoBranca from "@/shared/assets/logo_branca.png"
import { useAuth } from "@/shared/context/auth-context"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/shared/components/ui/sidebar"
import { Typography } from "@/shared/components/ui/typography"

const mainItems = [
  {
    title: "Visão geral",
    href: "/dashboard",
    icon: HomeIcon,
  },
]

const supportItems = [
  {
    title: "Seguradoras",
    href: "/seguradoras",
    icon: CircleDollarSignIcon,
  },
  {
    title: "Produtos",
    href: "/produtos",
    icon: PackageIcon,
  },
  {
    title: "Tipos de produto",
    href: "/tipos-de-produto",
    icon: TagsIcon,
  },
  {
    title: "Clientes",
    href: "/clientes",
    icon: UsersIcon,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    router.replace("/login")
  }

  return (
    <Sidebar
      collapsible="icon"
      className="border-none"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              tooltip="Mainiere"
              className="h-24"
            >
              <Link href="/dashboard">
                <Image
                  src={logoBranca}
                  alt="Mainiere"
                  priority
                  className="w-48 max-w-none shrink-0 group-data-[collapsible=icon]:w-16"
                />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/90">
            Principal
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className="text-sidebar-foreground"
                    isActive={
                      pathname === item.href ||
                      (item.href !== "/" && pathname?.startsWith(item.href))
                    }
                  >
                    <Link href={item.href}>
                      <item.icon />

                      <Typography
                        asChild
                        variant="small"
                        className="text-sidebar-foreground"
                      >
                        <span>{item.title}</span>
                      </Typography>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/90">
            Operação
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {supportItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className="text-sidebar-foreground"
                    isActive={
                      pathname === item.href ||
                      (item.href !== "/" && pathname?.startsWith(item.href))
                    }
                  >
                    <Link href={item.href}>
                      <item.icon />

                      <Typography
                        asChild
                        variant="small"
                        className="text-sidebar-foreground"
                      >
                        <span>{item.title}</span>
                      </Typography>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Sair"
              onClick={handleLogout}
              className="text-sidebar-foreground"
            >
              <LogOutIcon />

              <Typography
                asChild
                variant="small"
                className="text-sidebar-foreground"
              >
                <span>Sair</span>
              </Typography>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
