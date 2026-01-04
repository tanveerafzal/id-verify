/**
 * TrustCredo Design System
 * ========================
 *
 * A centralized design system using shadcn/ui components.
 * Import components from here to ensure consistent styling across the app.
 *
 * USAGE:
 *   import { Button, Input, Select, Card } from '@/design-system'
 *
 * TO CHANGE GLOBAL STYLES:
 *   - Button styles: Edit src/design-system/components/Button.tsx
 *   - Input styles: Edit src/design-system/components/Input.tsx
 *   - Select styles: Edit src/design-system/components/Select.tsx
 *   - Card styles: Edit src/design-system/components/Card.tsx
 *   - Theme tokens: Edit src/design-system/theme.ts
 */

// Theme
export { theme } from './theme';
export type { Theme } from './theme';

// Button
export { Button, IconButton } from './components/Button';
export type { ButtonProps, IconButtonProps } from './components/Button';

// Input
export { Input, Textarea } from './components/Input';
export type { InputProps, TextareaProps } from './components/Input';

// Select
export {
  Select,
  SelectRoot,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectOption,
  SelectSeparator,
} from './components/Select';
export type { SimpleSelectProps, SelectOption as SelectOptionType } from './components/Select';

// Card
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './components/Card';
export type { CardProps } from './components/Card';

// Re-export shadcn components that don't need customization
export { Checkbox } from '@/components/ui/checkbox';
export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from '@/components/ui/form';
export { Label } from '@/components/ui/label';
export { Toaster, toast } from 'sonner';
