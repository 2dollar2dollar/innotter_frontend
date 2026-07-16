import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { BrowserRouter } from 'react-router-dom';
import { MainLayout } from './MainLayout';
import { ProfileForm } from '~/components/forms/ProfileForm';

const meta = {
  title: 'Layouts/MainLayout',
  component: MainLayout,
  decorators: [
    (Story: React.ElementType) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
} satisfies Meta<typeof MainLayout>;

export default meta;
type Story = StoryObj<typeof MainLayout>;

export const WithProfileForm: Story = {
  args: {
    children: <ProfileForm />,
  },
};
