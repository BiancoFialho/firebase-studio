// src/app/login/page.tsx
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation'; // Use Next.js navigation
import { HardHat, LogIn } from 'lucide-react'; // Added LogIn icon

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    // --- Authentication Logic Placeholder ---
    // In a real application, you would:
    // 1. Send the username and password to your backend API.
    // 2. The backend would verify the credentials (e.g., against a database).
    // 3. If successful, the backend would issue a session token or JWT.
    // 4. Store the token securely (e.g., in an HttpOnly cookie).
    // 5. Redirect the user to the main application page.
    // 6. Set an application-wide state indicating the user is authenticated.

    // Mock authentication for demonstration:
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

    if (username === 'admin' && password === 'password') { // Replace with real validation
      toast({
        title: 'Login Bem-sucedido!',
        description: 'Redirecionando para o dashboard...',
      });
      // --- Set Authentication State ---
      // In a real app, update your global auth context/state here.
      // For this example, we'll directly navigate, but the layout logic
      // needs a proper state management solution (Context API, Zustand, Redux)
      // to conditionally render the sidebar based on actual auth status.
      // For now, the layout still uses a hardcoded `isAuthenticated = false`.
      // You'll need to implement state management for this to work fully.
      // Example: authContext.login();
      router.push('/'); // Redirect to the dashboard (now the home page)
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
    <div className="flex min-h-screen items-center justify-center">
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
            <CardFooter>
            <Button className="w-full" type="submit" disabled={isLoading}>
                 {isLoading ? 'Entrando...' : <><LogIn className="mr-2 h-4 w-4" /> Entrar</>}
            </Button>
            </CardFooter>
        </form>
        </Card>
    </div>
  );
}
