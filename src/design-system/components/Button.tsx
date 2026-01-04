/**
 * TrustCredo Design System - Button Component
 * Based on Figma: Mobile SDK Flow Design
 *
 * Pill-shaped buttons with emerald green primary color
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

/**
 * Button Variants - Figma SDK Flow Style
 * =====================================
 * Primary: Solid green pill button
 * Secondary: White with border
 * Ghost: Transparent
 */
const buttonStyles = cva(
  // Base styles - pill shape from Figma
  [
    'inline-flex items-center justify-center gap-2',
    'font-semibold',
    'transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
    'whitespace-nowrap',
    'rounded-full',  // Pill shape from Figma
  ],
  {
    variants: {
      variant: {
        // Primary - Green solid button (Figma main CTA)
        primary: [
          'bg-[#10B981]',
          'text-white',
          'hover:bg-[#059669]',
          'active:bg-[#047857]',
          'focus:ring-[#10B981]',
          'shadow-sm',
          'hover:shadow-md',
        ],

        // Secondary - White with gray border
        secondary: [
          'bg-white',
          'text-[#374151]',
          'border border-[#D1D5DB]',
          'hover:bg-[#F9FAFB]',
          'hover:border-[#9CA3AF]',
          'focus:ring-[#10B981]',
        ],

        // Outline - Green border, transparent background
        outline: [
          'bg-transparent',
          'text-[#10B981]',
          'border-2 border-[#10B981]',
          'hover:bg-[#10B981]',
          'hover:text-white',
          'focus:ring-[#10B981]',
        ],

        // Ghost - Minimal, no border
        ghost: [
          'bg-transparent',
          'text-[#6B7280]',
          'hover:bg-[#F3F4F6]',
          'hover:text-[#111827]',
          'focus:ring-[#10B981]',
        ],

        // Danger - Red for destructive actions
        danger: [
          'bg-[#EF4444]',
          'text-white',
          'hover:bg-[#DC2626]',
          'focus:ring-[#EF4444]',
        ],

        // Success - Same as primary (green)
        success: [
          'bg-[#10B981]',
          'text-white',
          'hover:bg-[#059669]',
          'focus:ring-[#10B981]',
        ],

        // Link style
        link: [
          'bg-transparent',
          'text-[#10B981]',
          'underline-offset-4',
          'hover:underline',
          'hover:text-[#059669]',
          'focus:ring-0',
          'p-0 h-auto rounded-none',
        ],

        // Dark - For use on dark backgrounds (camera UI)
        dark: [
          'bg-white',
          'text-[#111827]',
          'hover:bg-[#F3F4F6]',
          'focus:ring-white',
        ],
      },

      size: {
        sm: 'h-9 px-4 text-sm',
        md: 'h-11 px-6 text-sm',
        lg: 'h-12 px-8 text-base',
        xl: 'h-14 px-10 text-lg',
        icon: 'h-11 w-11',
      },

      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonStyles> {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      loading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(buttonStyles({ variant, size, fullWidth }), className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : leftIcon ? (
          leftIcon
        ) : null}
        {children}
        {rightIcon && !loading ? rightIcon : null}
      </button>
    );
  }
);

Button.displayName = 'Button';

/**
 * Icon Button - Circular button for icons only
 */
export interface IconButtonProps extends Omit<ButtonProps, 'leftIcon' | 'rightIcon' | 'children'> {
  icon: React.ReactNode;
  'aria-label': string;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, className, size = 'icon', ...props }, ref) => {
    return (
      <Button ref={ref} size={size} className={className} {...props}>
        {icon}
      </Button>
    );
  }
);

IconButton.displayName = 'IconButton';

/**
 * Camera Capture Button - White circular button for camera UI
 */
export const CaptureButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        'w-16 h-16 rounded-full',
        'bg-white',
        'border-4 border-white',
        'shadow-lg',
        'flex items-center justify-center',
        'hover:scale-105 active:scale-95',
        'transition-transform duration-150',
        'focus:outline-none focus:ring-4 focus:ring-white/50',
        className
      )}
      {...props}
    >
      <div className="w-12 h-12 rounded-full bg-white border-2 border-[#E5E7EB]" />
    </button>
  );
});

CaptureButton.displayName = 'CaptureButton';
