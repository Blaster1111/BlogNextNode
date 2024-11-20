// src/app/posts/[id].tsx
import { GetStaticProps, GetStaticPaths } from 'next';
import { api } from '../../lib/api';
import { Post } from '../../types';

interface PostPageProps {
  post: Post;
}

export default function PostPage({ post }: PostPageProps) {
  if (!post) return <div>Post not found</div>;

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await api.get('/posts');
  const posts: Post[] = response.data;

  const paths = posts.map((post) => ({
    params: { id: post._id.toString() },  // Ensure this matches your dynamic route
  }));

  return {
    paths,
    fallback: 'blocking',  // Will wait for new post to be generated
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { id } = params as { id: string };
  const response = await api.get(`/posts/${id}`);
  const post: Post = response.data;

  return {
    props: { post },
    revalidate: 10,  // This will re-generate the page at most once every 10 seconds
  };
};
