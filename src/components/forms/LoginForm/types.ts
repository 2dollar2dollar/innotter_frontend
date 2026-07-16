export interface LoginFormValues {
  email: string;
  password?: string;
  rememberMe: boolean;
}

export interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => void;
  isLoading?: boolean;
  serverError?: string | null;
}
