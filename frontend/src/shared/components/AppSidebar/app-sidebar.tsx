"use client"

import Link from "next/link"
import {
  CircleDollarSignIcon,
  FileTextIcon,
  HomeIcon,
  LifeBuoyIcon,
  ShieldCheckIcon,
  UsersIcon,
} from "lucide-react"

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

const mainItems = [
  {
    title: "Visao geral",
    href: "/",
    icon: HomeIcon,
    isActive: true,
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
  {
    title: "Clientes",
    href: "#",
    icon: UsersIcon,
  },
]

const supportItems = [
  {
    title: "Financeiro",
    href: "#",
    icon: CircleDollarSignIcon,
  },
  {
    title: "Suporte",
    href: "#",
    icon: LifeBuoyIcon,
  },
]

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" variant="inset">
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
                <span aria-hidden className="text-base leading-none">
                  🛡️
                </span>
                <span className="group-data-[collapsible=icon]:hidden">
                  Gerenciamento de seguros
                </span>
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
                    isActive={item.isActive}
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Operacao</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {supportItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
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
