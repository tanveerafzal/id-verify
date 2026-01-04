/**
 * TrustCredo Design System - Input Component
 *
 * This wraps input elements with consistent styling.
 * Change styles here to update ALL inputs across the app.
 *
 * Usage:
 *   import { Input } from '@/design-system'
 *   <Input label="Email" placeholder="Enter email" />
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

/**
 * Input Styles Configuration
 * =========================
 * Modify these styles to change input appearance globally.
 */
const inputStyles = cva(
  [
    'w-full',
    'bg-white',
    'border border-gray-200',
    'text-gray-900',
    'placeholder:text-gray-400',
    'transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-[#667eea] focus:ring-offset-0 focus:border-[#667eea]',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50',
  ],
  {
    variants: {
      size: {
        sm: 'h-8 px-3 text-sm rounded-md',
        md: 'h-10 px-4 text-sm rounded-lg',
        lg: 'h-12 px-4 text-base rounded-lg',
      },
      variant: {
        default: 'hover:border-gray-300',
        filled: 'bg-gray-50 border-transparent hover:bg-gray-100 focus:bg-white',
        flushed: 'rounded-none border-x-0 border-t-0 px-0 focus:ring-0',
      },
      error: {
        true: 'border-red-500 focus:ring-red-500 focus:border-red-500',
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

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputStyles> {
  /** Label text */
  label?: string;
  /** Helper text below input */
  helperText?: string;
  /** Error message */
  errorMessage?: string;
  /** Left icon or element */
  leftElement?: React.ReactNode;
  /** Right icon or element */
  rightElement?: React.ReactNode;
  /** Show password toggle for password inputs */
  showPasswordToggle?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      size,
      variant,
      error,
      label,
      helperText,
      errorMessage,
      leftElement,
      rightElement,
      showPasswordToggle,
      required,
      disabled,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;
    const hasError = error || !!errorMessage;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {leftElement && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {leftElement}
            </div>
          )}

          <input
            ref={ref}
            type={inputType}
            disabled={disabled}
            className={cn(
              inputStyles({ size, variant, error: hasError }),
              leftElement && 'pl-10',
              (rightElement || (isPassword && showPasswordToggle) || hasError) && 'pr-10',
              className
            )}
            {...props}
          />

          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {hasError && !rightElement && !showPasswordToggle && (
              <AlertCircle className="h-4 w-4 text-red-500" />
            )}

            {isPassword && showPasswordToggle && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            )}

            {rightElement}
          </div>
        </div>

        {(helperText || errorMessage) && (
          <p
            className={cn(
              'mt-1.5 text-sm',
              errorMessage ? 'text-red-500' : 'text-gray-500'
            )}
          >
            {errorMessage || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

/**
 * Textarea Component
 * ==================
 */
const textareaStyles = cva(
  [
    'w-full',
    'bg-white',
    'border border-gray-200',
    'text-gray-900',
    'placeholder:text-gray-400',
    'transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-[#667eea] focus:ring-offset-0 focus:border-[#667eea]',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50',
    'resize-none',
  ],
  {
    variants: {
      size: {
        sm: 'p-3 text-sm rounded-md',
        md: 'p-4 text-sm rounded-lg',
        lg: 'p-4 text-base rounded-lg',
      },
      error: {
        true: 'border-red-500 focus:ring-red-500 focus:border-red-500',
        false: '',
      },
    },
    defaultVariants: {
      size: 'md',
      error: false,
    },
  }
);

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>,
    VariantProps<typeof textareaStyles> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      size,
      error,
      label,
      helperText,
      errorMessage,
      required,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const hasError = error || !!errorMessage;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          rows={rows}
          className={cn(textareaStyles({ size, error: hasError }), className)}
          {...props}
        />

        {(helperText || errorMessage) && (
          <p
            className={cn(
              'mt-1.5 text-sm',
              errorMessage ? 'text-red-500' : 'text-gray-500'
            )}
          >
            {errorMessage || helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
