'use client'; // Add 'use client' directive

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import {
    HardHat, ShieldCheck, Stethoscope, FileText, FlaskConical, ClipboardList,
    BarChart3, Settings, Activity, Bug, Scale, Users, ListChecks, LogIn, LayoutDashboard // Keep LayoutDashboard
} from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, AuthContext } from '@/contexts/auth-context'; // Import AuthProvider and AuthContext
import { useContext } from 'react';


const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// Note: Metadata can't be defined in a 'use client' file directly.
// If dynamic metadata based on auth is needed, it requires a different approach.
// For now, keep static metadata or move it to a parent server component if possible.
/*
export const metadata: Metadata = {
  title: 'SSMA Control',
  description: 'Gerenciamento de Segurança, Saúde e Meio Ambiente para Nery Mecatrônica',
};
*/

// Component to conditionally render layout based on auth state
function AppLayout({ children }: { children: React.ReactNode }) {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    // This case should ideally be handled by AuthProvider structure
    // or show a loading state if auth check is async.
    return <div className="flex min-h-screen items-center justify-center">Carregando...</div>; // Or a loading indicator
  }

  const { isAuthenticated } = authContext;

  return (
    <>
      {isAuthenticated ? (
        <SidebarProvider>
          <Sidebar collapsible="icon" variant="sidebar" side="left">
            <SidebarHeader className="flex items-center justify-between p-4">
              <Link href="/" className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
                <HardHat className="h-6 w-6 text-primary" />
                <span className="font-semibold text-lg text-primary">SSMA Control</span>
              </Link>
              <SidebarTrigger className="md:hidden"/>
            </SidebarHeader>
            <SidebarContent className="p-2">
              <SidebarMenu>
                {/* Dashboard Link */}
                <SidebarMenuItem>
                   {/* Changed href to "/" for dashboard/home */}
                   <SidebarMenuButton asChild tooltip="Dashboard BI" isActive={true}> {/* Example: Mark dashboard active */}
                    <Link href="/">
                      <LayoutDashboard />
                      <span>Dashboard BI</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {/* Core Management Modules - Reordered */}
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Treinamentos">
                    <Link href="/trainings">
                      <HardHat />
                      <span>Treinamentos</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                   <SidebarMenuButton asChild tooltip="EPIs">
                     <Link href="/ppe">
                       <ShieldCheck />
                       <span>EPIs</span>
                      </Link>
                   </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="ASOs">
                    <Link href="/asos">
                      <Stethoscope />
                      <span>ASOs</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Inventário Químico">
                    <Link href="/chemicals">
                      <FlaskConical />
                      <span>Inventário Químico</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Análise de Riscos (JSA)">
                    <Link href="/jsa">
                      <ClipboardList />
                      <span>Análise de Riscos</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {/* New Modules */}
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Prevenção (CIPA)">
                    <Link href="/prevention">
                      <Users /> {/* Or ListChecks */}
                      <span>Prevenção (CIPA)</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Doenças Ocupacionais">
                    <Link href="/diseases">
                      <Bug />
                      <span>Doenças Ocup.</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Estatísticas Acidentes">
                    <Link href="/statistics">
                      <Activity />
                      <span>Estatísticas</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Compliance & Ações">
                    <Link href="/compliance">
                      <Scale /> {/* Or FileCheck2 */}
                      <span>Compliance</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>


                {/* Future placeholders */}
                {/* ... other future links ... */}
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="p-2 mt-auto">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Configurações">
                    <Link href="/settings">
                      <Settings />
                      <span>Configurações</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                 {/* Optional: Add Logout button here */}
                 {/* <SidebarMenuItem> ... Logout Button ... </SidebarMenuItem> */}
              </SidebarMenu>
            </SidebarFooter>
          </Sidebar>
          <SidebarInset>
            <header className="flex items-center justify-between p-4 border-b md:border-none">
              <SidebarTrigger className="hidden md:flex"/>
              {/* Placeholder for potential header content like user profile */}
              <div></div>
            </header>
            <main className="flex-1 p-4 md:p-6 overflow-auto">
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
      ) : (
        // Render only the page content (Login or Register page) if not authenticated
        <div className="flex min-h-screen items-center justify-center bg-background">
          {children}
        </div>
      )}
      <Toaster />
    </>
  );
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
       <head>
           {/* Metadata can be placed here if static */}
           <title>SSMA Control</title>
           <meta name="description" content="Gerenciamento de Segurança, Saúde e Meio Ambiente para Nery Mecatrônica" />
       </head>
      <body className={cn(geistSans.variable, geistMono.variable, 'antialiased')}>
          <AuthProvider> {/* Wrap with AuthProvider */}
              <AppLayout>{children}</AppLayout> {/* Use the conditional layout component */}
          </AuthProvider>
      </body>
    </html>
  );
}
