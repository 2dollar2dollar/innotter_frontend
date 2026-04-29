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
    color: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    color: 'secondary',
  },
};
