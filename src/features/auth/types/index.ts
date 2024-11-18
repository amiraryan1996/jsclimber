/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

type signupDataType = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};
export type TCreateUser = {
  data: signupDataType;
  toast: ({ ...props }: any) => {
    id: string;
    dismiss: () => void;
    update: (props: any) => void;
  };
  router: AppRouterInstance;
};

type verifyCredentialsDataType = {
  email: string;
  password: string;
};
export type TverifyCredentials = {
  data: verifyCredentialsDataType;
  toast: ({ ...props }: any) => {
    id: string;
    dismiss: () => void;
    update: (props: any) => void;
  };
  router: AppRouterInstance;
};
