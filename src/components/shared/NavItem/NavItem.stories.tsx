import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { NavItem } from './NavItem';

import HomeIcon from '../../../assets/Home.png';
import AvatarIcon from '../../../assets/no_avatar.png';

const meta = {
  title: 'Shared/NavItem',
  component: NavItem,
} satisfies Meta<typeof NavItem>;

export default meta;
type Story = StoryObj<typeof NavItem>;

export const DefaultInactive: Story = {
  args: {
    label: 'Explore',
    iconSrc: HomeIcon,
    isActive: false,
  },
};

export const ActiveState: Story = {
  args: {
    label: 'Home',
    iconSrc: HomeIcon,
    isActive: true,
  },
};

export const ProfileItem: Story = {
  args: {
    label: 'Profile',
    iconSrc: AvatarIcon,
    isActive: false,
    isAvatar: true,
  },
};
