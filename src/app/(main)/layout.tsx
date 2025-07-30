'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  useSidebar,
} from '@/components/ui/sidebar';
import { StyleWiseLogo } from '@/components/icons';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  Users,
  Package,
  Bot,
  Flame,
  User,
  LogOut,
  PlusCircle,
  Menu,
  LayoutGrid,
  Shirt,
  Sparkles,
  Heart,
  Store,
} from 'lucide-react';
import { useUser } from '@/hooks/use-user';
import { useRouter } from 'next/navigation';

const navItems = [
  { href: '/dashboard', label: 'Painel', icon: LayoutGrid },
  { href: '/wardrobe', label: 'Guarda-roupa', icon: Shirt },
  { href: '/builder', label: 'Construtor IA', icon: Sparkles },
  { href: '/feed', label: 'Inspiração', icon: Flame },
  { href: '/profile', label: 'Perfil', icon: User },
];

const storeNavItems = [
    { href: '/post', label: 'Postar no Feed', icon: PlusCircle, storeOnly: true },
]

function UserNav() {
  const { user } = useUser();
  const router = useRouter();

  const handleLogout = () => {
    // Mock logout logic
    router.push('/login');
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.avatarUrl} alt={user?.name} data-ai-hint="avatar person" />
            <AvatarFallback>{user?.name?.[0].toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href="/profile" passHref>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Perfil</span>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


function AppSidebar() {
    const pathname = usePathname();
    const { user } = useUser();

    const allNavItems = user?.type === 'store' ? [...navItems, ...storeNavItems] : navItems;
    
    const mainNavItems = allNavItems.filter(item => item.href !== '/outfit-of-the-day');

    return (
        <Sidebar collapsible="icon" className="border-r">
            <SidebarHeader>
                <div className="flex h-12 items-center justify-center p-2 group-data-[collapsible=icon]:hidden">
                    <StyleWiseLogo className="h-8 w-auto" />
                </div>
                 <div className="hidden h-12 items-center justify-center p-2 group-data-[collapsible=icon]:flex">
                    <Sparkles className="h-6 w-6 text-accent" />
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    {mainNavItems.map((item) => (
                        <SidebarMenuItem key={item.href}>
                            <Link href={item.href}>
                                <SidebarMenuButton
                                    isActive={pathname === item.href}
                                    tooltip={{children: item.label}}
                                >
                                    <item.icon className="h-5 w-5" />
                                    <span>{item.label}</span>
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
        </Sidebar>
    )
}

function MobileHeader() {
    const { toggleSidebar } = useSidebar();
    return (
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 md:hidden">
            <Button
                size="icon"
                variant="outline"
                className="md:hidden"
                onClick={toggleSidebar}
            >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Alternar Menu</span>
            </Button>
            <StyleWiseLogo className="h-6 w-auto" />
            <div className="ml-auto">
                <UserNav />
            </div>
        </header>
    )
}


export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="flex flex-col">
                <header className="sticky top-0 z-10 hidden h-16 items-center justify-end gap-4 border-b bg-background px-4 sm:px-6 md:flex">
                    <UserNav />
                </header>
                <MobileHeader />
                <main className="flex-1 overflow-auto p-4 sm:p-6">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
