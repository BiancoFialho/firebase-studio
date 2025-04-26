// src/app/login/page.tsx
'use client';

import React, { useState, useContext } from 'react';
import Link from 'next/link'; // Import Link
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { HardHat, LogIn, UserPlus } from 'lucide-react'; // Added UserPlus icon
import { AuthContext } from '@/contexts/auth-context'; // Import AuthContext

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const authContext = useContext(AuthContext);

  if (!authContext) {
    // Handle the case where context is not available, though this shouldn't happen
    // if the layout is set up correctly.
    return <div>Error: Auth context not found.</div>;
  }

  const { login } = authContext;

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    // --- Authentication Logic Placeholder ---
    // Simulating backend validation
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

    // Use updated credentials
    if (username === 'Bianco' && password === '06747116') {
      toast({
        title: 'Login Bem-sucedido!',
        description: 'Redirecionando para o dashboard...',
      });
      login(); // Update authentication state using context
      router.push('/'); // Redirect to the dashboard
    } else {
      toast({
        title: 'Falha no Login',
        description: 'Usuário ou senha inválidos.',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
    // --- End Authentication Logic Placeholder ---
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
        <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
               <HardHat className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-2xl">Login SSMA Control</CardTitle>
            <CardDescription>Entre com suas credenciais para acessar o sistema.</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
            <CardContent className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="username">Usuário</Label>
                <Input
                id="username"
                type="text"
                placeholder="Digite seu usuário"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                />
            </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                <Button className="w-full" type="submit" disabled={isLoading}>
                    {isLoading ? 'Entrando...' : <><LogIn className="mr-2 h-4 w-4" /> Entrar</>}
                </Button>
                {/* Add Link to Registration Page */}
                <Button variant="outline" className="w-full" asChild>
                    <Link href="/register">
                       <UserPlus className="mr-2 h-4 w-4" /> Registrar Novo Usuário
                    </Link>
                </Button>
            </CardFooter>
        </form>
        </Card>
    </div>
  );
}
