export interface User {
  charAt(arg0: number): import("react").ReactNode;
  _id: string;
  email: string;
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  authorId: User;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}