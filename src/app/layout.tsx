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
    BarChart3, Settings, Activity, Bug, Scale, Users, ListChecks, FileCheck2, LogIn // Added LogIn icon
} from 'lucide-react'; // Removed LayoutDashboard, added LogIn
import { Toaster } from '@/components/ui/toaster';


const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'SSMA Control',
  description: 'Gerenciamento de Segurança, Saúde e Meio Ambiente para Nery Mecatrônica',
};

// Placeholder for authentication status - replace with actual auth logic
const isAuthenticated = false; // Set to true after successful login

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={cn(geistSans.variable, geistMono.variable, 'antialiased')}>
         {/* Conditionally render Sidebar based on authentication */}
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
                        <SidebarMenuButton asChild tooltip="Dashboard BI">
                          <Link href="/"> {/* Changed href to "/" */}
                            <BarChart3 />
                            <span>Dashboard BI</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>

                      {/* Core Management Modules */}
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Treinamentos">
                           <Link href="/trainings">
                            <HardHat />
                            <span>Treinamentos</span>
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
                         <SidebarMenuButton asChild tooltip="EPIs">
                           <Link href="/ppe">
                             <ShieldCheck />
                             <span>EPIs</span>
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
                        <SidebarMenuButton asChild tooltip="Estatísticas Acidentes">
                          <Link href="/statistics">
                            <Activity />
                            <span>Estatísticas</span>
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
                         <SidebarMenuButton asChild tooltip="Compliance & Ações">
                           <Link href="/compliance">
                             <Scale /> {/* Or FileCheck2 */}
                             <span>Compliance</span>
                           </Link>
                         </SidebarMenuButton>
                       </SidebarMenuItem>


                      {/* Future placeholders - can be uncommented later */}
                     {/*
                     <SidebarMenuItem>
                       <SidebarMenuButton asChild tooltip="Programas (PGR, PCMSO, PCA)">
                         <Link href="/programs">
                           <FileText />
                           <span>Programas</span>
                         </Link>
                       </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Laudo Ergonômico">
                         <Link href="/ergonomics">
                            {/* Need a suitable icon for Ergonomics - using ClipboardList for now */}
                            {/* <ClipboardList />
                           <span>Laudo Ergonômico</span>
                         </Link>
                       </SidebarMenuButton>
                     </SidebarMenuItem>
                     <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Relatórios">
                         <Link href="/reports">
                           <BarChart3 />
                           <span>Relatórios</span>
                         </Link>
                       </SidebarMenuButton>
                     </SidebarMenuItem> */}
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
              // Render only the login page if not authenticated
              <div className="flex min-h-screen items-center justify-center bg-background">
                  {children} {/* This will render the login page */}
              </div>
         )}
         <Toaster />
      </body>
    </html>
  );
}
