# Surgent Web Template

React template for Surgent AI App Builder.

## Stack

- **Runtime**: Bun
- **Framework**: React 19 + Vite 7 + TypeScript
- **Routing**: React Router 7
- **Styling**: Tailwind CSS 4 (OKLCH colors)
- **State**: Zustand (global) + React Query (server)
- **Forms**: React Hook Form + Zod
- **UI**: 60+ shadcn/ui components (Radix primitives) in `src/components/ui/`
- **Backend**: Convex (optional)

## Structure

```
src/
├── components/
│   ├── ui/           # shadcn components (Button, Card, Dialog, Form, Table...)
│   └── error/        # ErrorBoundary, RouteErrorBoundary
├── hooks/            # useIsMobile, custom hooks
├── lib/              # cn(), errorReporter
├── pages/            # Route components
├── main.tsx          # App entry + route definitions
└── index.css         # Tailwind + theme variables
```

## Scripts

```bash
bun dev          # Dev server (localhost:3000)
bun build        # Production build
bun typecheck    # Type check
bun dev:convex   # Dev with Convex sync
```

## Adding Pages & Routes

1. Create page in `src/pages/dashboard.tsx`:
```tsx
export default function DashboardPage() {
  return <div>Dashboard</div>
}
```

2. Add route in `src/main.tsx` inside the `routes` array:
```tsx
import DashboardPage from '@/pages/dashboard'
import { RouteErrorBoundary } from '@/components/error/route-error-boundary'

// Add to createBrowserRouter routes array:
{
  path: '/dashboard',
  element: <DashboardPage />,
  errorElement: <RouteErrorBoundary />,
}
```

## Patterns

```tsx
// Always use @/ alias for imports
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Conditional classes with cn()
<div className={cn('base', isActive && 'active')} />

// Mobile detection (768px breakpoint)
const isMobile = useIsMobile()
```

## Styling

Theme variables in `src/index.css` using OKLCH:

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
}
```

## Naming

- Files: `kebab-case.tsx`
- Components: `PascalCase`
- Hooks: `use-kebab-case.ts`

## Rules

1. **Use Bun** - never npm/yarn/pnpm
2. **Use existing shadcn components** from `src/components/ui/` before creating new ones
3. **Use `@/` imports** - never relative `../`
4. **Run `bun typecheck`** before committing
5. **Keep it simple** - build MVPs first
