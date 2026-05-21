export interface SignupFormValues {
  fullName: string;
  email: string;
  phone: string;
  username: string;
}

export interface SignupFormProps {
  onSubmit: (values: SignupFormValues) => void;
  isLoading?: boolean;
  serverError?: string | null;
}
