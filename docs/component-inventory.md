# Component Inventory

## Overview

RateMyApartment uses **shadcn/ui** as its component library, built on Radix UI primitives with Tailwind CSS styling. Components are located in `client/src/components/`.

## Component Categories

### Layout Components

| Component | File | Description |
|-----------|------|-------------|
| Card | `ui/card.tsx` | Container with header, content, footer |
| Separator | `ui/separator.tsx` | Horizontal/vertical divider |
| Aspect Ratio | `ui/aspect-ratio.tsx` | Maintain aspect ratios |
| Resizable | `ui/resizable.tsx` | Resizable panel groups |
| Scroll Area | `ui/scroll-area.tsx` | Custom scrollbar container |
| Sidebar | `ui/sidebar.tsx` | Collapsible navigation sidebar |

### Form Components

| Component | File | Description |
|-----------|------|-------------|
| Button | `ui/button.tsx` | Primary action trigger (5 variants, 4 sizes) |
| Input | `ui/input.tsx` | Text input field |
| Textarea | `ui/textarea.tsx` | Multi-line text input |
| Checkbox | `ui/checkbox.tsx` | Boolean toggle |
| Radio Group | `ui/radio-group.tsx` | Single selection from options |
| Select | `ui/select.tsx` | Dropdown selection |
| Switch | `ui/switch.tsx` | On/off toggle |
| Slider | `ui/slider.tsx` | Range input |
| Form | `ui/form.tsx` | Form context with react-hook-form |
| Label | `ui/label.tsx` | Input label |
| Input OTP | `ui/input-otp.tsx` | One-time password input |

### Feedback Components

| Component | File | Description |
|-----------|------|-------------|
| Toast | `ui/toast.tsx` | Notification message |
| Toaster | `ui/toaster.tsx` | Toast container |
| Alert | `ui/alert.tsx` | Inline alert message |
| Alert Dialog | `ui/alert-dialog.tsx` | Confirmation dialog |
| Progress | `ui/progress.tsx` | Progress indicator |
| Skeleton | `ui/skeleton.tsx` | Loading placeholder |
| Badge | `ui/badge.tsx` | Status indicator |

### Navigation Components

| Component | File | Description |
|-----------|------|-------------|
| Navigation Menu | `ui/navigation-menu.tsx` | Main navigation |
| Menubar | `ui/menubar.tsx` | Application menu bar |
| Breadcrumb | `ui/breadcrumb.tsx` | Path navigation |
| Pagination | `ui/pagination.tsx` | Page navigation |
| Tabs | `ui/tabs.tsx` | Tabbed content |

### Overlay Components

| Component | File | Description |
|-----------|------|-------------|
| Dialog | `ui/dialog.tsx` | Modal dialog |
| Sheet | `ui/sheet.tsx` | Slide-out panel (4 sides) |
| Drawer | `ui/drawer.tsx` | Bottom drawer (mobile) |
| Popover | `ui/popover.tsx` | Floating content |
| Tooltip | `ui/tooltip.tsx` | Hover information |
| Hover Card | `ui/hover-card.tsx` | Preview on hover |
| Dropdown Menu | `ui/dropdown-menu.tsx` | Action menu |
| Context Menu | `ui/context-menu.tsx` | Right-click menu |
| Command | `ui/command.tsx` | Command palette (cmdk) |

### Data Display Components

| Component | File | Description |
|-----------|------|-------------|
| Table | `ui/table.tsx` | Data table |
| Avatar | `ui/avatar.tsx` | User avatar |
| Calendar | `ui/calendar.tsx` | Date picker calendar |
| Chart | `ui/chart.tsx` | Data visualization |
| Carousel | `ui/carousel.tsx` | Image/content slider |

### Utility Components

| Component | File | Description |
|-----------|------|-------------|
| Accordion | `ui/accordion.tsx` | Collapsible sections |
| Collapsible | `ui/collapsible.tsx` | Show/hide content |
| Toggle | `ui/toggle.tsx` | Pressed state button |
| Toggle Group | `ui/toggle-group.tsx` | Multiple toggles |

## Custom Components

### ThemeProvider
**File**: `components/theme-provider.tsx`

Provides dark/light theme context to the application.

```typescript
interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
  isDark: boolean;
}
```

**Features**:
- Persists to localStorage
- Respects system preference
- Syncs with document class

### ThemeToggle
**File**: `components/theme-toggle.tsx`

Toggle button for switching themes.

**Variants**:
- `default` - Icon button
- `hero` - Pill button with label (for hero section)

## Custom Hooks

### useToast
**File**: `hooks/use-toast.ts`

Global toast notification system using reducer pattern.

```typescript
const { toast, dismiss, toasts } = useToast();

toast({
  title: "Success",
  description: "Your review was submitted",
});
```

### useMobile
**File**: `hooks/use-mobile.tsx`

Detects mobile viewport for responsive behavior.

## Button Variants

The Button component supports multiple variants:

| Variant | Use Case |
|---------|----------|
| `default` | Primary actions |
| `secondary` | Secondary actions |
| `outline` | Tertiary actions |
| `ghost` | Minimal/icon buttons |
| `destructive` | Dangerous actions |

| Size | Dimensions |
|------|------------|
| `default` | h-9, px-4 |
| `sm` | h-8, px-3 |
| `lg` | h-10, px-8 |
| `icon` | h-9, w-9 |

## Design Tokens

Components use CSS variables defined in `index.css`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 47.4% 11.2%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --accent: 210 40% 96.1%;
  /* ... */
}
```

## Usage Example

```tsx
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

function ReviewForm() {
  return (
    <Card>
      <CardHeader>Write a Review</CardHeader>
      <CardContent>
        <Input placeholder="Building address..." />
        <Button type="submit">Submit</Button>
      </CardContent>
    </Card>
  );
}
```

## Component Count Summary

| Category | Count |
|----------|-------|
| Layout | 6 |
| Form | 11 |
| Feedback | 7 |
| Navigation | 5 |
| Overlay | 9 |
| Data Display | 5 |
| Utility | 4 |
| Custom | 2 |
| **Total** | **49+** |
