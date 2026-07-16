import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Avatar } from './Avatar';
import noAvatar from '~/assets/no_avatar.png';

const meta = {
  title: 'Shared/Avatar',
  component: Avatar,
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Small: Story = {
  args: {
    src: noAvatar,
    size: 'small',
  },
};

export const LargeWithEdit: Story = {
  args: {
    src: noAvatar,
    size: 'large',
    showEditButton: true,
  },
};
