import type { Meta, StoryObj } from '@storybook/react';
import { NumberBall } from '../draws/NumberBall';

const meta: Meta<typeof NumberBall> = {
  title: 'Draws/NumberBall',
  component: NumberBall,
  tags: ['autodocs'],
  argTypes: {
    number: {
      control: 'number',
      min: 0,
      max: 45,
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof NumberBall>;

export const Default: Story = {
  args: {
    number: 23,
  },
};

export const Primary: Story = {
  args: {
    number: 5,
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    number: 12,
    variant: 'secondary',
  },
};

export const Success: Story = {
  args: {
    number: 34,
    variant: 'success',
  },
};

export const Warning: Story = {
  args: {
    number: 41,
    variant: 'warning',
  },
};

export const Small: Story = {
  args: {
    number: 45,
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    number: 7,
    size: 'lg',
  },
};

export const AllNumbers: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: 46 }, (_, i) => (
        <NumberBall key={i} number={i} size="sm" />
      ))}
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex flex-col gap-2">
        <span className="font-medium">Primary:</span>
        <div className="flex gap-2">
          {[5, 12, 23, 34, 41].map((n) => (
            <NumberBall key={n} number={n} variant="primary" />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="font-medium">Secondary:</span>
        <div className="flex gap-2">
          {[5, 12, 23, 34, 41].map((n) => (
            <NumberBall key={n} number={n} variant="secondary" />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="font-medium">Success:</span>
        <div className="flex gap-2">
          {[5, 12, 23, 34, 41].map((n) => (
            <NumberBall key={n} number={n} variant="success" />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="font-medium">Warning:</span>
        <div className="flex gap-2">
          {[5, 12, 23, 34, 41].map((n) => (
            <NumberBall key={n} number={n} variant="warning" />
          ))}
        </div>
      </div>
    </div>
  ),
};
