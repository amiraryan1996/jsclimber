import { NextResponse } from 'next/server';
import { migrate } from '@/app/api/migration';

// trigger migrate:
// http://localhost:3001/api/migrate
export async function GET() {
  migrate();
  return NextResponse.json({ message: 'Migrations completed.' });
}
