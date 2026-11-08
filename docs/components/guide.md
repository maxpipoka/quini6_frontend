# Component Guide

This guide documents the component architecture, patterns, and Storybook usage for the Quini6 Frontend.

## 📁 Component Organization

```
src/components/
├── admin/           # Admin panel components
│   ├── HealthDashboard.tsx
│   ├── Sidebar.tsx
│   └── ...
├── ui/              # Base UI components (buttons, inputs, cards, etc.)
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   └── ...
├── layout/          # Layout components
│   ├── Header.astro
│   ├── Footer.astro
│   └── ...
└── ...              # Feature-specific components
```

## 🎯 Component Patterns

### 1. Astro Components (`.astro`)

Use for static or server-rendered components with minimal interactivity.

```astro
---
// src/components/ui/Card.astro
interface Props {
  title: string;
  children: any;
}
const { title, children } = Astro.props;
---
<div class="card">
  <h3>{title}</h3>
  <slot>{children}</slot>
</div>
```

### 2. React Components (`.tsx`)

Use for interactive components requiring client-side state, effects, or complex UI logic.

```tsx
// src/components/ui/Button.tsx
import { clsx } from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'btn',
        `btn-${variant}`,
        `btn-${size}`,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
```

### 3. Container-Presentational Pattern

Separate data/logic (containers) from pure UI (presentational).

```tsx
// Container: src/components/admin/HealthDashboardContainer.tsx
import { useEffect, useState } from 'react';
import { HealthDashboard } from './HealthDashboard';
import { healthCheck, healthDbCheck } from '@/lib/api/client';

export function HealthDashboardContainer() {
  const [apiHealth, setApiHealth] = useState<HealthStatus>();
  const [dbHealth, setDbHealth] = useState<HealthStatus>();

  const refresh = async () => {
    const [api, db] = await Promise.all([healthCheck(), healthDbCheck()]);
    setApiHealth(api);
    setDbHealth(db);
  };

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 30000);
    return () => clearInterval(interval);
  }, []);

  return <HealthDashboard apiHealth={apiHealth} dbHealth={dbHealth} onRefresh={refresh} />;
}
```

```tsx
// Presentational: src/components/admin/HealthDashboard.tsx
import { StatusCard } from '@/components/ui/StatusCard';

interface HealthDashboardProps {
  apiHealth?: HealthStatus;
  dbHealth?: HealthStatus;
  onRefresh: () => void;
}

export function HealthDashboard({ apiHealth, dbHealth, onRefresh }: HealthDashboardProps) {
  return (
    <div className="health-dashboard">
      <div className="flex justify-between items-center mb-4">
        <h2>Salud del Sistema</h2>
        <Button onClick={onRefresh}>Actualizar</Button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <StatusCard title="API" status={apiHealth} />
        <StatusCard title="Base de Datos" status={dbHealth} />
      </div>
    </div>
  );
}
```

## 📖 Storybook Usage

### Running Storybook

```bash
npm run storybook
```

Opens at `http://localhost:6006`

### Building Static Storybook

```bash
npm run build-storybook
```

Outputs to `storybook-static/` — deployable to any static host.

### Writing Stories

#### Basic Component Story

```tsx
// src/components/ui/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-2">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
    </div>
  ),
};
```

#### Story with Complex Props

```tsx
// src/components/admin/HealthDashboard.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { HealthDashboard } from './HealthDashboard';
import { http, HttpResponse } from 'msw';

const meta: Meta<typeof HealthDashboard> = {
  title: 'Admin/HealthDashboard',
  component: HealthDashboard,
  parameters: {
    msw: {
      handlers: [
        http.get('/api/health', () => HttpResponse.json({ status: 'healthy' })),
        http.get('/api/health/db', () => HttpResponse.json({ status: 'healthy' })),
      ],
    },
  },
};

export default meta;
type Story = StoryObj<typeof HealthDashboard>;

export const Healthy: Story = {
  args: {
    apiHealth: { status: 'healthy', latency: 45 },
    dbHealth: { status: 'healthy', latency: 12 },
  },
};

export const Degraded: Story = {
  args: {
    apiHealth: { status: 'degraded', latency: 250 },
    dbHealth: { status: 'healthy', latency: 15 },
  },
};

export const Down: Story = {
  args: {
    apiHealth: { status: 'down', latency: 0, error: 'Connection refused' },
    dbHealth: { status: 'healthy', latency: 10 },
  },
};

export const Loading: Story = {
  args: {
    apiHealth: undefined,
    dbHealth: undefined,
  },
};
```

### Storybook Addons Used

| Addon | Purpose |
| :---- | :------ |
| `@storybook/addon-essentials` | Controls, Actions, Backgrounds, Viewport, Toolbars |
| `@storybook/addon-interactions` | Interaction testing with play functions |
| `@storybook/addon-a11y` | Accessibility testing (axe-core) |
| `@storybook/addon-links` | Link stories together |

### Writing Interaction Tests (play functions)

```tsx
export const InteractionTest: Story = {
  args: {
    apiHealth: { status: 'healthy', latency: 45 },
    dbHealth: { status: 'healthy', latency: 12 },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const refreshButton = canvas.getByRole('button', { name: /actualizar/i });
    
    await step('Click refresh button', async () => {
      await userEvent.click(refreshButton);
    });
    
    await step('Verify history updated', async () => {
      expect(canvas.getByText(/última actualización/i)).toBeInTheDocument();
    });
  },
};
```

### Accessibility Testing

Run a11y checks in Storybook:

1. Open the **Accessibility** tab in the addons panel
2. Violations are highlighted with severity levels
3. Click violations for remediation guidance

### Visual Regression Testing

Visual tests run via Playwright, not Storybook directly. See `tests/visual/`.

## 🧪 Testing Components

### Unit Tests (Vitest + React Testing Library)

```tsx
// src/components/ui/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('applies variant classes', () => {
    render(<Button variant="secondary">Test</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-secondary');
  });

  it('calls onClick handler', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
```

### Storybook Interaction Tests

```tsx
// In .stories.tsx
export const WithInteraction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button'));
    await expect(canvas.getByText('Clicked!')).toBeInTheDocument();
  },
};
```

## 📝 Component Documentation Checklist

When adding a new component:

- [ ] Create component file (`.astro` or `.tsx`)
- [ ] Add TypeScript types for props
- [ ] Write Storybook story (`.stories.tsx`)
- [ ] Add unit tests (`.test.tsx`)
- [ ] Document in this guide if reusable
- [ ] Add to relevant index.ts for exports
- [ ] Verify accessibility (run a11y in Storybook)
- [ ] Test responsive behavior (viewport addon)

## 🔧 Component Conventions

### Naming

- **PascalCase**: Component files (`Button.tsx`, `HealthDashboard.tsx`)
- **kebab-case**: Astro files (`card.astro`, `page-layout.astro`)
- **Descriptive**: Use domain-specific names (`ImportWizard`, not `Wizard`)

### Props Interface

```tsx
// Always define explicit interface
interface ComponentProps {
  // Required props first
  title: string;
  onAction: (id: string) => void;
  
  // Optional props with defaults
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  
  // HTML attribute passthrough
  className?: string;
  'data-testid'?: string;
}
```

### Default Props

```tsx
export function Component({
  variant = 'primary',
  size = 'md',
  disabled = false,
  className,
  ...props
}: ComponentProps) {
  // ...
}
```

### CSS Classes

Use `clsx` for conditional classes:

```tsx
import { clsx } from 'clsx';

const className = clsx(
  'base-classes',
  variant === 'primary' && 'primary-classes',
  size === 'lg' && 'large-classes',
  disabled && 'disabled-classes',
  customClassName
);
```

## 🔗 Related Documentation

- [TypeDoc API Reference](../api/README.md) — Run `npm run docs:generate`
- [Deploy Runbook](../runbooks/deploy.md)
- [Rollback Runbook](../runbooks/rollback.md)
- [Debugging Runbook](../runbooks/debugging.md)
- [Monitoring Runbook](../runbooks/monitoring.md)