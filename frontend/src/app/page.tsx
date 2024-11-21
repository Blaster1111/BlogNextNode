import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { serverApi } from '@/lib/server-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export default async function HomePage() {
  const cookieStore = cookies();
  const authToken = cookieStore.get('token');

  if (!authToken) {
    redirect('/login');
  }

  try {
    const response = await serverApi.get('/posts', {
      headers: {
        'Authorization': `Bearer ${authToken.value}`
      }
    });
    const posts = response.data.data;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl sm:text-3xl font-bold text-center">
                Discover Latest Blog Posts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {posts.length === 0 ? (
                <p className="text-center text-muted-foreground text-sm sm:text-base">
                  No posts available
                </p>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {posts.map((post: any) => (
                    <div
                      key={post._id}
                      className="border rounded-lg p-3 sm:p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 space-y-2 sm:space-y-0">
                        <Link
                          href={`/posts/${post._id}`}
                          className="text-lg sm:text-xl font-semibold hover:text-blue-600 w-full truncate"
                        >
                          {post.title}
                        </Link>
                        <Badge
                          variant="secondary"
                          className="text-xs sm:text-sm"
                        >
                          {new Date(post.createdAt).toLocaleDateString()}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm sm:text-base line-clamp-2">
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
  } catch (error) {
    console.error('Error fetching posts:', error);

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50 p-4">
        <Card className="w-full max-w-md sm:max-w-sm shadow-2xl">
          <CardHeader>
            <CardTitle className="text-center text-xl sm:text-2xl font-bold text-red-600">
              Error Loading Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground text-sm sm:text-base">
              Unable to fetch posts. Please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
}