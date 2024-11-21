'use client';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { clientApi } from '@/lib/client-api';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Link from 'next/link';

export default function LoginPage() {
  const { toast } = useToast();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        toast({ 
          title: 'Error', 
          description: 'Email and password are required.', 
          variant: 'destructive' 
        });
        return;
      }

      const response = await clientApi.post('/login', { email, password });
      login(response.data.data.accessToken);
      toast({ title: 'Success!', description: 'Logged in successfully.' });
      router.push('/dashboard');
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Failed to log in.', 
        variant: 'destructive' 
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl md:text-3xl">
            Login to Your Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full"
          />
          <Input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full"
          />
          <Button 
            onClick={handleLogin} 
            className="w-full"
          >
            Log In
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center text-sm">
          <p>
            Don't have an account? {' '}
            <Link href="/signup" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}