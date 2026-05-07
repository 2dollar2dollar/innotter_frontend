import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Button } from './Button';

type Story = StoryObj<typeof Button>;

const meta = {
  title: 'Shared/Button',
  component: Button,
} satisfies Meta<typeof Button>;

export default meta;

export const Primary: Story = {
  args: {
    children: 'Primary Button',
    size: 'medium',
  },
};

export const SmallPostButton: Story = {
  args: {
    children: 'Post',
    size: 'small',
  },
};

export const SmallDisabled: Story = {
  args: {
    children: 'Post',
    size: 'small',
    disabled: true,
  },
};
