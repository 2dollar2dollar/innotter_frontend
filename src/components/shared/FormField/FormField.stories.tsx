import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { FormField } from './FormField';

type Story = StoryObj<typeof FormField>;

const meta = {
  title: 'Shared/FormField',
  component: FormField,
} satisfies Meta<typeof FormField>;

export default meta;

export const Default: Story = {
  args: {
    label: 'Email address',
    placeholder: 'Enter your email',
    name: 'email',
  },
};

export const Password: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    name: 'password',
  },
};

export const Phone: Story = {
  args: {
    label: 'Phone number',
    isPhone: true,
    name: 'phone',
  },
};

export const ErrorState: Story = {
  args: {
    label: 'Username',
    placeholder: 'Choose a username',
    name: 'username',
    error: true,
    helperText: 'Username is already taken',
  },
};
