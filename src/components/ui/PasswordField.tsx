import { EyeOffIcon, EyeIcon } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { Box } from '@/components/ui/box';
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { createElement, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { calculateStrength } from '@/lib/utils';

// https://gist.github.com/mjbalcueva/b21f39a8787e558d4c536bf68e267398

type PasswordFieldProps = {
  showStrength?: boolean;
  loading?: boolean;
  name?: string;
  placeholder?: string;
  description?: string | JSX.Element;
};

export function PasswordField({
  showStrength = false,
  loading = false,
  name = 'password',
  placeholder = 'Enter password',
  description,
}: PasswordFieldProps) {
  const { control, getFieldState } = useFormContext();
  const [passwordVisibility, setPasswordVisibility] = useState(false);

  // Password strength state
  const [strength, setStrength] = useState(0);
  const handlePasswordChange = (password: string) => {
    setStrength(calculateStrength(password));
  };
  return (
    <>
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Box className="relative">
                <Input
                  disabled={loading}
                  {...field}
                  onChange={(e) => {
                    // Retain react-hook-form control
                    field.onChange(e);
                    handlePasswordChange(e.target.value);
                  }}
                  type={passwordVisibility ? 'text' : 'password'}
                  autoComplete="on"
                  placeholder={placeholder}
                  className={`pr-12 ${getFieldState(name).error && 'text-destructive'}`}
                />
                <Box
                  className="absolute inset-y-0 right-0 flex cursor-pointer items-center p-3 text-muted-foreground"
                  onClick={() => setPasswordVisibility(!passwordVisibility)}
                >
                  {createElement(passwordVisibility ? EyeOffIcon : EyeIcon, {
                    className: 'size-4',
                  })}
                </Box>
              </Box>
            </FormControl>
            <FormMessage />
            {description && <FormDescription>{description}</FormDescription>}
          </FormItem>
        )}
      />
      {showStrength && (
        <Progress
          value={strength}
          className={`h-1 ${
            strength > 60 ? 'bg-green-500' : strength > 30 ? 'bg-yellow-500' : 'bg-red-500'
          }`}
        />
      )}
    </>
  );
}
