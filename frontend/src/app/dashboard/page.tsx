'use client';
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { clientApi } from '@/lib/client-api';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import Cookies from 'js-cookie';

interface Post {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function DashboardPage() {
  const { toast } = useToast();
  const { authenticated, user, logout } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [isCreatePostDialogOpen, setIsCreatePostDialogOpen] = useState(false);

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!authenticated) return;
  
      try {
        const token = Cookies.get('token');
        const response = await clientApi.get('/posts', {
          params: { author: 'me' },
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setPosts(response.data.data);
        setIsLoading(false);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch your posts',
          variant: 'destructive'
        });
        setIsLoading(false);
      }
    };
  
    fetchUserPosts();
  }, [authenticated]);

  const handleCreatePost = async () => {
    if (!postTitle.trim() || !postContent.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide both title and content',
        variant: 'destructive'
      });
      return;
    }

    try {
      const token = Cookies.get('token');
      const response = await clientApi.post('/post', 
        { title: postTitle, content: postContent },
        { 
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      const newPost = response.data.data;
      setPosts([newPost, ...posts]);
      setPostTitle('');
      setPostContent('');
      setIsCreatePostDialogOpen(false);
      toast({
        title: 'Success',
        description: 'Post created successfully',
        variant: 'default'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create post',
        variant: 'destructive'
      });
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 p-4">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-xl sm:text-2xl font-bold text-gray-800">
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-sm sm:text-base text-gray-600">
              Please log in to access your dashboard.
            </p>
            <Link href="/login" className="block">
              <Button className="w-full" variant="outline">
                Go to Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        {/* User Profile Card */}
        <Card className="shadow-lg">
          <CardHeader className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Avatar className="w-12 h-12 sm:w-16 sm:h-16">
              <AvatarImage src="/placeholder-avatar.png" alt="User Avatar" />
              <AvatarFallback>{user?.email?.[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left w-full">
              <CardTitle className="text-xl sm:text-2xl">
                Welcome, {user?.email || 'User'}
              </CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Manage your account
              </p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-auto flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Dialog 
                open={isCreatePostDialogOpen} 
                onOpenChange={setIsCreatePostDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full sm:w-auto">
                    Create Post
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create a New Post</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input 
                      placeholder="Post Title" 
                      value={postTitle}
                      onChange={(e) => setPostTitle(e.target.value)}
                    />
                    <Textarea 
                      placeholder="Post Content" 
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      className="min-h-[150px]"
                    />
                    <Button onClick={handleCreatePost} className="w-full">
                      Publish Post
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Link href="/" className="w-full sm:w-auto">
                <Button variant="secondary" size="sm" className="w-full sm:w-auto">
                  Home Page
                </Button>
              </Link>
              <Button 
                onClick={logout} 
                variant="destructive" 
                size="sm" 
                className="w-full sm:w-auto"
              >
                Logout
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Posts Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Your Posts</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-center text-xs sm:text-sm text-muted-foreground">
                Loading posts...
              </p>
            ) : posts.length === 0 ? (
              <p className="text-center text-xs sm:text-sm text-muted-foreground">
                No posts found
              </p>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {posts.map((post) => (
                  <div 
                    key={post._id} 
                    className="border rounded-lg p-3 sm:p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-2 gap-2">
                      <Link 
                        href={`/posts/${post._id}`} 
                        className="text-base sm:text-lg font-semibold hover:text-blue-600 w-full truncate"
                      >
                        {post.title}
                      </Link>
                      <Badge 
                        variant="secondary" 
                        className="text-xs sm:text-sm w-auto self-start sm:self-auto"
                      >
                        {new Date(post.createdAt).toLocaleDateString()}
                      </Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                      {post.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}