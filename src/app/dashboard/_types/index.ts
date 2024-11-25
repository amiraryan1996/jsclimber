import { PostStatus } from '@prisma/client';
// TODO: prisma generated types usage
export type TPost = {
  image: string;
  status: PostStatus;
  description: string;
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  categoryId: string;
};
