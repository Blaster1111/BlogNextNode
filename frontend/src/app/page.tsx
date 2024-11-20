"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { Post, ApiResponse } from "@/types";
import axios from "axios";

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMyPosts, setIsMyPosts] = useState(false);  // State to track if viewing my posts
  const router = useRouter();
  const { authenticated } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await api.get<ApiResponse<Post[]>>("/posts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: isMyPosts ? { author: "me" } : {},  // Modify to only get user's posts
        });

        // Assuming the API response follows the ApiResponse interface
        if (response.data.success) {
          setPosts(response.data.data);
          setError(null);
        } else {
          setError(response.data.message || "Failed to fetch posts");
        }
      } catch (err) {
        console.error("Error fetching posts:", err);

        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message ||
            "Failed to fetch posts. Please try again."
          );
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [router, isMyPosts]);  // Re-run on changing view mode

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 text-xl">Loading posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Blog Posts</h1>
          {authenticated && (
            <>
              <Button onClick={() => router.push('/dashboard')}>Write New Post</Button>
              <Button onClick={() => setIsMyPosts(!isMyPosts)}>
                {isMyPosts ? "All Posts" : "My Posts"}
              </Button>
              <Button onClick={handleLogout}>Logout</Button>
            </>
          )}
        </div>
        <div className="grid gap-6">
          {posts.length ? (
            posts.map((post) => (
              <Card key={post._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold">{post.title}</CardTitle>
                  <p className="text-sm text-gray-500">
                    By {post.authorId.email} • {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 line-clamp-3">{post.content}</p>
                  <Button
                    variant="link"
                    className="mt-4 p-0"
                    onClick={() => router.push(`/post/${post._id}`)}
                  >
                    Read more →
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No posts found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
