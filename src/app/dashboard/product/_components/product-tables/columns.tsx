'use client';
import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import { CellAction } from './cell-action';
import { TPost } from '@/app/dashboard/_types';

type PostWithCategory = TPost & {
  category: { id: string; name: string };
};

export const columns: ColumnDef<PostWithCategory>[] = [
  {
    accessorKey: 'image',
    header: 'Image',
    cell: ({ row }) => {
      const imageUrl = row.getValue('image');
      return (
        <div className="relative aspect-square">
          <Image src={imageUrl as string} alt={row.getValue('title')} fill className="rounded-lg" />
        </div>
      );
    },
  },
  {
    accessorKey: 'title',
    header: 'TITLE',
  },

  {
    accessorKey: 'description',
    header: 'DESCRIPTION',
  },
  {
    accessorKey: 'category.name',
    header: 'CATEGORY',
  },
  {
    accessorKey: 'updatedAt',
    header: 'UPDATEDAT',
    cell: ({ row }) => {
      const updatedAt = row.getValue('updatedAt') as Date;
      const formattedUpdatedAt = updatedAt.toLocaleDateString();
      return <div>{formattedUpdatedAt}</div>;
    },
  },
  {
    accessorKey: 'status',
    header: 'STSTUS',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <div
          className={`w-fit px-1 ${status == 'PENDING' ? 'bg-yellow-600' : status == 'REJECTED' ? 'bg-red-600' : 'bg-green-600'}`}
        >
          {status}
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
