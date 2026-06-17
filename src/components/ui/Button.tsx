import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-brand-gold text-brand-dark hover:bg-brand-gold-dark focus-visible:ring-brand-gold shadow-md hover:shadow-lg",
        secondary:
          "border-2 border-brand-gold text-brand-gold bg-transparent hover:bg-brand-gold hover:text-brand-dark focus-visible:ring-brand-gold",
        ghost:
          "bg-transparent text-brand-dark hover:bg-brand-dark/10 focus-visible:ring-brand-dark",
        dark: "bg-brand-dark text-white hover:bg-brand-dark-light focus-visible:ring-brand-dark shadow-md",
        destructive:
          "bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500",
        link: "text-brand-gold underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-13 px-8 text-base",
        xl: "h-14 px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
