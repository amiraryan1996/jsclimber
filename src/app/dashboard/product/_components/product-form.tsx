'use client';
import { FileUploader } from '@/components/file-uploader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { TPost } from '../../_types';
import { uploadePost } from '../../_actions/update-post';
import { uploadImage } from '../../_actions/upload-image';
import { useState } from 'react';

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const formSchema = z.object({
  image: z
    .any()
    .refine((files) => files?.length == 1, 'Image is required.')
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      '.jpg, .jpeg, .png and .webp files are accepted.',
    ),
  title: z.string().min(2, {
    message: 'Product name must be at least 2 characters.',
  }),
  category: z.string(),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }),
});

export default function ProductForm({
  initialData,
  pageTitle,
  categories,
}: {
  initialData: TPost | null;
  pageTitle: string;
  categories: { name: string; id: string }[];
}) {
  const defaultValues = {
    title: initialData?.title || '',
    category: initialData?.categoryId
      ? categories.find((cat) => cat.id === initialData.categoryId)?.name || ''
      : '',
    description: initialData?.description || '',
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: defaultValues,
  });
  const [relativePath, setRelativePath] = useState('');
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const updatedPost = await uploadePost(initialData?.id || '', {
        ...values,
        image: relativePath, // Pass only the relative file path to the server action
      });

      console.log('Post updated successfully:', updatedPost);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  }
  async function uploadFile(files: File[]) {
    const formData = new FormData();
    formData.append('file', files[0]);
    setRelativePath(await uploadImage(formData));
  }
  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle className="text-left text-2xl font-bold">{pageTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <FileUploader
                      value={field.value}
                      onValueChange={field.onChange}
                      maxFiles={1}
                      maxSize={MAX_FILE_SIZE}
                      // accept={ACCEPTED_IMAGE_TYPES}
                      // disabled={loading}
                      // progresses={progresses}
                      // pass the onUpload function here for direct upload
                      // onUpload={uploadFiles}
                      onUpload={(files: File[]) => uploadFile(files)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Post Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Post Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={(value) => field.onChange(value)} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select categories" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((item, index) => (
                          <SelectItem key={index} value={item.name}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter product description"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Add Product</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
