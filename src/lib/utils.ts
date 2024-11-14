import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Active, DataRef, Over } from '@dnd-kit/core';
import { ColumnDragData } from '@/app/dashboard/kanban/_components/board-column';
import { TaskDragData } from '@/app/dashboard/kanban/_components/task-card';

type DraggableData = ColumnDragData | TaskDragData;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function hasDraggableData<T extends Active | Over>(
  entry: T | null | undefined,
): entry is T & {
  data: DataRef<DraggableData>;
} {
  if (!entry) {
    return false;
  }

  const data = entry.data.current;

  if (data?.type === 'Column' || data?.type === 'Task') {
    return true;
  }

  return false;
}

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: 'accurate' | 'normal';
  } = {},
) {
  const { decimals = 0, sizeType = 'normal' } = opts;

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const accurateSizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB'];
  if (bytes === 0) return '0 Byte';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === 'accurate' ? (accurateSizes[i] ?? 'Bytest') : (sizes[i] ?? 'Bytes')
  }`;
}

export function calculateStrength(value: string) {
  let score = 0;
  // scoring based on passwordSchema
  const rules = [
    { regex: /^.{8,20}$/, weight: 20 }, // Length between 8 and 20
    { regex: /[A-Z]/, weight: 20 }, // At least one uppercase letter
    { regex: /[a-z]/, weight: 20 }, // At least one lowercase letter
    { regex: /\d/, weight: 20 }, // At least one digit
    { regex: /[$&+,:;=?@#|'<>.^*()%!-]/, weight: 20 }, // At least one special character
  ];
  rules.forEach((rule) => {
    if (rule.regex.test(value)) {
      score += rule.weight;
    }
  });

  return score;
}
