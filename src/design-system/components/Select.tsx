/**
 * TrustCredo Design System - Select/Dropdown Component
 *
 * This wraps shadcn's Select component with consistent styling.
 * Change styles here to update ALL dropdowns across the app.
 *
 * Usage:
 *   import { Select, SelectOption } from '@/design-system'
 *   <Select placeholder="Choose...">
 *     <SelectOption value="1">Option 1</SelectOption>
 *     <SelectOption value="2">Option 2</SelectOption>
 *   </Select>
 */

import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Select Trigger Styles
 * ====================
 * Modify these to change dropdown button appearance
 */
const selectTriggerStyles = cva(
  [
    'flex items-center justify-between gap-2',
    'w-full',
    'bg-white',
    'border border-gray-200',
    'text-gray-900',
    'transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-[#667eea] focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    '[&>span]:truncate',
    'data-[placeholder]:text-gray-400',
  ],
  {
    variants: {
      size: {
        sm: 'h-8 px-3 text-sm rounded-md',
        md: 'h-10 px-4 text-sm rounded-lg',
        lg: 'h-12 px-4 text-base rounded-lg',
      },
      variant: {
        default: [
          'hover:border-gray-300',
        ],
        filled: [
          'bg-gray-50',
          'border-transparent',
          'hover:bg-gray-100',
        ],
        flushed: [
          'rounded-none',
          'border-x-0 border-t-0',
          'px-0',
          'focus:ring-0 focus:border-[#667eea]',
        ],
      },
      error: {
        true: 'border-red-500 focus:ring-red-500',
        false: '',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
      error: false,
    },
  }
);

/**
 * Select Content Styles
 * ====================
 * Modify these to change dropdown menu appearance
 */
const selectContentStyles = [
  'relative z-50',
  'min-w-[8rem] max-h-[300px]',
  'overflow-hidden',
  'bg-white',
  'border border-gray-200',
  'rounded-lg',
  'shadow-lg',
  'animate-in fade-in-0 zoom-in-95',
  'data-[side=bottom]:slide-in-from-top-2',
  'data-[side=top]:slide-in-from-bottom-2',
];

/**
 * Select Item Styles
 * =================
 * Modify these to change dropdown option appearance
 */
const selectItemStyles = [
  'relative flex items-center',
  'w-full',
  'px-3 py-2',
  'text-sm text-gray-700',
  'cursor-pointer',
  'select-none',
  'outline-none',
  'transition-colors duration-150',
  'hover:bg-gray-50',
  'focus:bg-[#667eea]/10 focus:text-[#667eea]',
  'data-[disabled]:opacity-50 data-[disabled]:pointer-events-none',
  'data-[state=checked]:bg-[#667eea]/10 data-[state=checked]:text-[#667eea]',
];

// Root Select Component
const SelectRoot = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

// Select Trigger
interface SelectTriggerProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>,
    VariantProps<typeof selectTriggerStyles> {}

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(({ className, children, size, variant, error, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(selectTriggerStyles({ size, variant, error }), className)}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 text-gray-400 transition-transform duration-200 group-data-[state=open]:rotate-180" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

// Select Scroll Up Button
const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn('flex items-center justify-center py-1 cursor-default', className)}
    {...props}
  >
    <ChevronUp className="h-4 w-4 text-gray-400" />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

// Select Scroll Down Button
const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn('flex items-center justify-center py-1 cursor-default', className)}
    {...props}
  >
    <ChevronDown className="h-4 w-4 text-gray-400" />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;

// Select Content
const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        selectContentStyles,
        position === 'popper' && 'data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1',
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          'p-1',
          position === 'popper' &&
            'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]'
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

// Select Label
const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn('px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider', className)}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

// Select Item (Option)
const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(selectItemStyles, className)}
    {...props}
  >
    <span className="absolute right-3 flex h-4 w-4 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

// Select Separator
const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn('my-1 h-px bg-gray-100', className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

/**
 * Simplified Select Component
 * ==========================
 * A simplified API for common use cases
 */
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SimpleSelectProps extends VariantProps<typeof selectTriggerStyles> {
  /** Array of options to display */
  options: SelectOption[];
  /** Currently selected value */
  value?: string;
  /** Callback when value changes */
  onChange?: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Disable the select */
  disabled?: boolean;
  /** Additional class names */
  className?: string;
  /** Name for form submission */
  name?: string;
  /** Show error state */
  error?: boolean;
  /** Error message to display */
  errorMessage?: string;
  /** Label text */
  label?: string;
  /** Required field */
  required?: boolean;
}

export const Select = React.forwardRef<HTMLButtonElement, SimpleSelectProps>(
  (
    {
      options,
      value,
      onChange,
      placeholder = 'Select an option...',
      disabled,
      className,
      size,
      variant,
      error,
      errorMessage,
      label,
      required,
    },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <SelectRoot value={value} onValueChange={onChange} disabled={disabled}>
          <SelectTrigger
            ref={ref}
            size={size}
            variant={variant}
            error={error}
            className={cn('group', className)}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </SelectRoot>
        {errorMessage && (
          <p className="mt-1.5 text-sm text-red-500">{errorMessage}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

// Export all components for advanced usage
export {
  SelectRoot,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};

// Alias for backwards compatibility
export const SelectOption = SelectItem;
