'use client';
import { TPost } from '../../_types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createPage } from '../_actions/create-page';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
// import Editor from '@/features/rich-text-editor/plate-ui-editor';
import { initialEditorValue } from '@/features/rich-text-editor/constants';

const formSchema = z.object({
  title: z.string().min(2, {
    message: 'Product name must be at least 2 characters.',
  }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }),
  categoryId: z.string(),
});

const PostForm = ({
  initialData,
  pageTitle,
  categories,
}: {
  initialData: TPost | null;
  pageTitle: string;
  categories: { name: string; id: string }[];
}) => {
  const defaultValues = {
    title: initialData?.title || '',
    description: initialData?.description || '',
    categoryId: initialData?.categoryId
      ? categories.find((cat) => cat.id === initialData.categoryId)?.name || ''
      : '',
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: defaultValues,
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const localValue = typeof window !== 'undefined' && localStorage.getItem('editorContent');
    const editorData = localValue ? JSON.parse(localValue) : initialEditorValue;

    const payload = { ...values, ...{ content: editorData } };
    console.log('payload :', payload);
    console.log('editor data type :', typeof editorData);
    try {
      console.log(payload);
      await createPage(payload);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  }

  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle className="text-left text-2xl font-bold">{pageTitle}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                name="categoryId"
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
                          <SelectItem key={index} value={item.id}>
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
            {/* <Editor /> */}
            <Button type="submit">Add Post</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PostForm;
