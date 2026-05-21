export interface ForgotPasswordFormValues {
  email: string;
}

export interface ForgotPasswordFormProps {
  onSubmit: (values: ForgotPasswordFormValues) => void;
  isLoading?: boolean;
  serverError?: string | null;
}
