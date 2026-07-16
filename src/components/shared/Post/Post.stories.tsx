import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Post } from './Post';

import avatarImg from '~/assets/no_avatar.png';
import postImg from '~/assets/image.png';

const meta = {
  title: 'Shared/Post',
  component: Post,
} satisfies Meta<typeof Post>;

export default meta;
type Story = StoryObj<typeof Post>;

export const FullPost: Story = {
  args: {
    authorName: 'Annie',
    authorHandle: '@annie',
    timeAgo: '14s',
    avatarUrl: avatarImg,
    content:
      'This is a post. It can be long, or short. Depends on what you have to say. This is a post. It can be long, or short. Depends on what you have to say.',
    imageUrl: postImg,
  },
};

export const TextOnly: Story = {
  args: {
    authorName: 'Annie',
    authorHandle: '@annie',
    timeAgo: '2h',
    avatarUrl: avatarImg,
    content: 'Just a text post without any images! Working perfectly.',
  },
};

export const ImageOnly: Story = {
  args: {
    authorName: 'Annie',
    authorHandle: '@annie',
    timeAgo: '5m',
    avatarUrl: avatarImg,
    imageUrl: postImg,
  },
};
