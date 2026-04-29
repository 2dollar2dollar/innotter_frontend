import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { ForgotPasswordForm } from './ForgotPasswordForm';

const meta = {
  title: 'Forms/ForgotPasswordForm',
  component: ForgotPasswordForm,
} satisfies Meta<typeof ForgotPasswordForm>;

export default meta;
type Story = StoryObj<typeof ForgotPasswordForm>;

export const Default: Story = {
  args: {
    onSubmit: (values) => alert(`Form submitted: ${JSON.stringify(values, null, 2)}`),
  },
};
