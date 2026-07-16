import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { LineDivider } from './LineDivider';
import { Box } from '@mui/material';

const meta = {
  title: 'Shared/LineDivider',
  component: LineDivider,
  decorators: [
    (Story: React.ElementType) => (
      <Box sx={{ p: 4, backgroundColor: '#fff' }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof LineDivider>;

export default meta;
type Story = StoryObj<typeof LineDivider>;

export const Default: Story = {};
