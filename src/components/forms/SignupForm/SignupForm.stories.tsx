import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { SignupForm } from './SignupForm';

const meta = {
  title: 'Forms/SignupForm',
  component: SignupForm,
} satisfies Meta<typeof SignupForm>;

export default meta;
type Story = StoryObj<typeof SignupForm>;

export const Default: Story = {
  args: {
    onSubmit: (values) => alert(`Form submitted: ${JSON.stringify(values, null, 2)}`),
  },
};
