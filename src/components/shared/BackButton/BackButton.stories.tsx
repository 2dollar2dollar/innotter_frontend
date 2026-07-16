import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { BrowserRouter } from 'react-router-dom';
import { BackButton } from './BackButton';

const meta = {
  title: 'Shared/BackButton',
  component: BackButton,
  decorators: [
    (Story: React.ElementType) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
} satisfies Meta<typeof BackButton>;

export default meta;
type Story = StoryObj<typeof BackButton>;

export const Default: Story = {
  args: {},
};
