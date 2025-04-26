// src/app/register/page.tsx
'use client';

import React, { useState, useContext } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { HardHat, UserPlus, ArrowLeft } from 'lucide-react';
import { AuthContext } from '@/contexts/auth-context'; // Import AuthContext

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return <div>Error: Auth context not found.</div>;
  }
  const { login } = authContext; // Use login from context after registration

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    if (password !== confirmPassword) {
      toast({
        title: 'Erro de Registro',
        description: 'As senhas não coincidem.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
         toast({
           title: 'Erro de Registro',
           description: 'A senha deve ter pelo menos 6 caracteres.',
           variant: 'destructive',
         });
         setIsLoading(false);
         return;
     }


    // --- Registration Logic Placeholder ---
    // In a real application, you would:
    // 1. Send the username and password to your backend API.
    // 2. The backend would check if the username exists.
    // 3. If not, hash the password and store the new user in the database.
    // 4. Optionally, log the user in automatically after successful registration.

    // Mock registration:
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

    // Simulate successful registration
    console.log('Mock registration successful for user:', username);
    toast({
      title: 'Registro Bem-sucedido!',
      description: 'Você foi registrado e logado. Redirecionando...',
    });

    // Automatically log the user in after successful registration
    login(); // Update auth state
    router.push('/'); // Redirect to the dashboard

    // Example of handling registration failure (e.g., username exists)
    // toast({
    //   title: 'Falha no Registro',
    //   description: 'Nome de usuário já existe.',
    //   variant: 'destructive',
    // });
    // setIsLoading(false);

    // --- End Registration Logic Placeholder ---
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
        <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
               <UserPlus className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-2xl">Registrar Novo Usuário</CardTitle>
            <CardDescription>Crie sua conta para acessar o SSMA Control.</CardDescription>
        </CardHeader>
        <form onSubmit={handleRegister}>
            <CardContent className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="username">Nome de Usuário</Label>
                <Input
                id="username"
                type="text"
                placeholder="Escolha um nome de usuário"
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
                placeholder="Crie uma senha (mín. 6 caracteres)"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                />
            </div>
             <div className="grid gap-2">
                 <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                 <Input
                 id="confirmPassword"
                 type="password"
                 placeholder="Repita a senha"
                 required
                 value={confirmPassword}
                 onChange={(e) => setConfirmPassword(e.target.value)}
                 disabled={isLoading}
                 />
             </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                <Button className="w-full" type="submit" disabled={isLoading}>
                    {isLoading ? 'Registrando...' : 'Registrar'}
                </Button>
                 <Button variant="link" className="w-full" asChild>
                    <Link href="/login">
                       <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Login
                    </Link>
                 </Button>
            </CardFooter>
        </form>
        </Card>
    </div>
  );
}
