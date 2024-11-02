'use client';
import { redirect } from 'next/navigation';
import { useAppStore } from '@/app/store';

export default function AdminHome() {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  if (!isAuthenticated) redirect('/admin/login');

  return (
    <div>
      <h1>Admin Panel</h1>
      <p>Welcome to the admin panel. Choose an action below.</p>
      <ul>
        <li>
          <a href="/admin/posts">Manage Posts</a>
        </li>
        <li>
          <a href="/admin/users">Manage Users</a>
        </li>
      </ul>
    </div>
  );
}
