// src/app/dashboard/_actions/upload-image.ts
'use server';
import fs from 'node:fs/promises';
import path from 'node:path';

export async function uploadImage(formData: FormData) {
  const imageFile = formData.get('file') as File;
  console.log(imageFile);
  const dateDir = new Date().toISOString().split('T')[0];
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', dateDir);
  const filePath = path.join(uploadDir, imageFile.name);
  const relativePath = path.join('/uploads', dateDir, imageFile.name);

  try {
    await fs.mkdir(uploadDir, { recursive: true });
    const buffer = new Uint8Array(await imageFile.arrayBuffer());
    await fs.writeFile(filePath, buffer);
    return relativePath;
  } catch (error) {
    console.error('Error updating post:', error);
    try {
      await fs.unlink(filePath);
    } catch (cleanupError) {
      console.error('Error cleaning up file:', cleanupError);
    }

    throw error;
  }
}
