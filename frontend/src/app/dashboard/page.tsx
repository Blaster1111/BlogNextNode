"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { authenticated } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to be logged in to post.");
      return;
    }

    try {
      await api.post(
        "/post",
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // After successful post, clear the fields and redirect to the home page
      setTitle("");
      setContent("");
      router.push("/"); // Redirect to the home page
      alert("Post published successfully!");
    } catch (error) {
      console.error("Error posting:", error);
      alert("Failed to publish the post");
    }
  };

  if (!authenticated) {
    return <p>Redirecting to login...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button variant="outline" onClick={() => router.back()}>
            Back
          </Button>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Create New Post</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="Post title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Textarea
                  placeholder="Write your post content here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[200px]"
                />
              </div>
              <Button type="submit">
                Publish Post
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
