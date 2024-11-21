import { serverApi } from '@/lib/server-api'
import { Metadata } from 'next'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface PostPageProps {
  params: { id: string }
}

export async function generateStaticParams() {
  try {
    const response = await serverApi.get('/posts')
    return response.data.data.map((post: any) => ({
      id: post.id,
    }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  try {
    const response = await serverApi.get(`/posts/${params.id}`)
    const post = response.data.data
    return {
      title: post.title,
      description: post.content.slice(0, 160),
    }
  } catch {
    return { title: 'Post Not Found' }
  }
}

export default async function PostPage({ params }: PostPageProps) {
  try {
    const response = await serverApi.get(`/posts/${params.id}`)
    const post = response.data.data

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8 flex justify-center items-center">
        <Card className="w-full max-w-3xl shadow-2xl">
          <CardHeader className="border-b p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-4xl font-bold text-gray-800">{post.title}</h1>
              <Badge variant="secondary" className="text-sm">
                {new Date(post.createdAt).toLocaleDateString()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  } catch {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader>
            <h1 className="text-3xl font-bold text-red-600 text-center">Post Not Found</h1>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              The post you are looking for does not exist or has been deleted.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }
}