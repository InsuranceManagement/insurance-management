"use client"

import {
  CircleDollarSignIcon,
  FileTextIcon,
  HomeIcon,
  LifeBuoyIcon,
  ShieldCheckIcon,
  UsersIcon,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
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
    title: "Visao geral",
    href: "/dashboard",
    icon: HomeIcon,
  },
  {
    title: "Apolices",
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
              <Link href="/">
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
                    isActive={
                      pathname === item.href ||
                      (item.href !== "/" && pathname?.startsWith(item.href))
                    }
                    tooltip={item.title}
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

      <SidebarRail />
    </Sidebar>
  )
}
