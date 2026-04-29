import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { TextField } from './TextField';

type Story = StoryObj<typeof TextField>;

const meta = {
  title: 'Shared/TextField',
  component: TextField,
} satisfies Meta<typeof TextField>;

export default meta;

export const Default: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
  },
};

export const Password: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
  },
};

export const ErrorEmailState: Story = {
  args: {
    label: 'Email',
    error: true,
    helperText: 'Invalid email format',
  },
};
