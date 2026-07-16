import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Box } from '@mui/material';
import { CreatePostForm } from './CreatePostForm';

const meta = {
  title: 'Forms/CreatePostForm',
  component: CreatePostForm,
  decorators: [
    (Story) => (
      <Box sx={{ p: 4, backgroundColor: '#fff', maxWidth: '800px' }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof CreatePostForm>;

export default meta;
type Story = StoryObj<typeof CreatePostForm>;

export const Default: Story = {};
