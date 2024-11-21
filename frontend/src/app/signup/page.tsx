'use client';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast'
import { clientApi } from '@/lib/client-api';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Link from 'next/link';

export default function SignupPage() {
  const { toast } = useToast();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignup = async () => {
    try {
      if (!email || !password) {
        toast({ 
          title: 'Error', 
          description: 'All fields are required.', 
          variant: 'destructive' 
        });
        return;
      }

      const response = await clientApi.post('/signup', { email, password });
      login(response.data.data.accessToken);
      toast({ 
        title: 'Success!', 
        description: 'Account created successfully.' 
      });
      router.push('/dashboard');
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Failed to sign up.', 
        variant: 'destructive' 
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl md:text-3xl">
            Create Your Account
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
            onClick={handleSignup} 
            className="w-full"
          >
            Sign Up
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center text-sm">
          <p>
            Already have an account? {' '}
            <Link href="/login" className="text-blue-600 hover:underline">
              Log In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}