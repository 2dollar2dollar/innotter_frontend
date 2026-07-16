import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { ProfileText } from './ProfileText';

const meta = {
  title: 'Shared/ProfileText',
  component: ProfileText,
} satisfies Meta<typeof ProfileText>;

export default meta;
type Story = StoryObj<typeof ProfileText>;

export const Primary: Story = {
  args: {
    children: 'Your name',
    colorVariant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'yourname@gmail.com',
    colorVariant: 'secondary',
  },
};
