import * as React from "react";
import { VariantProps, cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-normal tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:hover:bg-primaryGreen dark:hover:text-white disabled:opacity-50 dark:focus:ring-slate-400 disabled:pointer-events-none dark:focus:ring-offset-slate-900 data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-slate-800 uppercase",
  {
    variants: {
      variant: {
        default:
          "bg-slate-900 text-white hover:bg-primaryGreen dark:bg-slate-50 dark:text-slate-900",
        outline:
          "bg-transparent border-2 border-white hover:bg-primaryGreen dark:border-white dark:text-slate-100",
      },
      size: {
        big: "h-20 py-20 px-20",
        default: "h-9 py-1 px-8",
        sm: "h-8 px-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  href?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ size, variant, className, children, onClick, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
