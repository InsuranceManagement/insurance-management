"use client"

import {
  CircleDollarSignIcon,
  FileTextIcon,
  HomeIcon,
  LifeBuoyIcon,
  LogOutIcon,
  PackageIcon,
  ShieldCheckIcon,
  UsersIcon,
  TagsIcon,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

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
  {
    title: "Apólices",
    href: "#",
    icon: FileTextIcon,
  },
  {
    title: "Sinistros",
    href: "#",
    icon: ShieldCheckIcon,
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
  {
    title: "Suporte",
    href: "#",
    icon: LifeBuoyIcon,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const { logout, user } = useAuth()

  const handleLogout = () => {
    logout()
    router.replace("/login")
  }

  return (
    <Sidebar
      collapsible="icon"
      variant="inset"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              tooltip="Gerenciamento de seguros"
              className="group-data-[collapsible=icon]:justify-center"
            >
              <Link href="/dashboard">
                <span
                  aria-hidden
                  className="text-base leading-none"
                >
                  🛡️
                </span>

                <Typography
                  asChild
                  variant="small"
                  className="group-data-[collapsible=icon]:hidden"
                >
                  <span>Gerenciamento de seguros</span>
                </Typography>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Principal</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
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
          <SidebarGroupLabel>Operação</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {supportItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
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
            >
              <LogOutIcon />

              <Typography
                asChild
                variant="small"
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
