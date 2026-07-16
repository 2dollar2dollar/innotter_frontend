import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Logo } from './Logo';

const meta = {
  title: 'Shared/Logo',
  component: Logo,
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof Logo>;

export const Hero: Story = {
  args: { size: 'hero' },
};

export const Header: Story = {
  args: { size: 'header' },
};
