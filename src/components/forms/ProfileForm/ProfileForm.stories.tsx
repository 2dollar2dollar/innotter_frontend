import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { ProfileForm } from './ProfileForm';

const meta = {
  title: 'Forms/ProfileForm',
  component: ProfileForm,
} satisfies Meta<typeof ProfileForm>;

export default meta;
type Story = StoryObj<typeof ProfileForm>;

export const Default: Story = {};
