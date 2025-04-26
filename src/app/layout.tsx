
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
} from '@/components/ui/sidebar'; // Ensure all sidebar components are imported
import Link from 'next/link';
import {
    HardHat, ShieldCheck, Stethoscope, FileText, FlaskConical, ClipboardList,
    BarChart3, Settings, Activity, Bug, Scale, Users, ListChecks, LogIn, LogOut, LayoutDashboard, UserPlus // Added LogOut
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

  // Add a check in case context is somehow undefined during render cycle
  if (authContext === undefined) {
      console.error("AuthContext is undefined in AppLayout. Check Provider.");
      // Return loading or error state, or potentially null if safe
      return <div className="flex min-h-screen items-center justify-center">Carregando Auth...</div>;
  }


  const { isAuthenticated, logout } = authContext;
  // console.log("AppLayout rendering, isAuthenticated:", isAuthenticated); // Debug log

  return (
    <>
      {isAuthenticated ? (
        <SidebarProvider>
          {/* Sidebar component itself */}
          <Sidebar collapsible="icon" variant="sidebar" side="left">
            <SidebarHeader className="flex items-center justify-between p-4">
              <Link href="/" className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
                <HardHat className="h-6 w-6 text-primary" />
                <span className="font-semibold text-lg text-primary">SSMA Control</span>
              </Link>
               {/* Ensure trigger is inside header */}
               <SidebarTrigger className="md:hidden" />
            </SidebarHeader>
            <SidebarContent className="p-2">
              <SidebarMenu>
                {/* Dashboard Link */}
                <SidebarMenuItem>
                   <SidebarMenuButton asChild tooltip="Dashboard BI"> {/* Removed isActive={true} for now */}
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
                 {/* Add Logout button here */}
                 <SidebarMenuItem>
                   <SidebarMenuButton tooltip="Sair" onClick={logout} className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                      <LogOut />
                      <span>Sair</span>
                    </SidebarMenuButton>
                 </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </Sidebar>
          {/* SidebarInset should contain the main content area */}
          <SidebarInset>
            <header className="flex items-center justify-between p-4 border-b md:border-none sticky top-0 bg-background/80 backdrop-blur-sm z-10">
               {/* Trigger for desktop */}
               <SidebarTrigger className="hidden md:flex"/>
              {/* Placeholder for potential header content like user profile */}
              <div className="flex items-center gap-4">
                  {/* User Profile / Logout for Header - Optional */}
                  <span className="text-sm text-muted-foreground hidden sm:inline">Usuário: Bianco</span>
                  <Button variant="ghost" size="sm" onClick={logout} className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                      <LogOut className="mr-2 h-4 w-4" /> Sair
                  </Button>
              </div>
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
       {/* Added suppressHydrationWarning={true} to body tag */}
      <body className={cn(geistSans.variable, geistMono.variable, 'antialiased')} suppressHydrationWarning={true}>
          <AuthProvider> {/* Wrap with AuthProvider */}
              <AppLayout>{children}</AppLayout> {/* Use the conditional layout component */}
          </AuthProvider>
      </body>
    </html>
  );
}
