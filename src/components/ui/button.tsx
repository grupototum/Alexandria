import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-[16px] font-normal transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "btn-primary",
        secondary: "btn-outline",
        ghost: "button-ghost",
        link: "text-primary underline-offset-4 hover:underline",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        "gradient-action": "btn-primary",
      },
      size: {
        default: "",
        sm: "text-[14px]",
        lg: "px-8 py-4 text-[18px]",
        icon: "h-9 w-9",
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

interface CompatButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

// Legacy Aliases - mapped to Krea variants
const GlowButton = React.forwardRef<HTMLButtonElement, CompatButtonProps>(
  ({ className, children, ...props }, ref) => (
    <Button ref={ref} variant="gradient-action" className={cn(className)} {...props}>
      {children}
    </Button>
  )
);
GlowButton.displayName = "GlowButton";

const BeamButton = React.forwardRef<HTMLButtonElement, CompatButtonProps>(
  ({ className, children, ...props }, ref) => (
    <Button ref={ref} variant="primary" className={cn(className)} {...props}>
      {children}
    </Button>
  )
);
BeamButton.displayName = "BeamButton";

const OutlineButton = React.forwardRef<HTMLButtonElement, CompatButtonProps>(
  ({ className, children, ...props }, ref) => (
    <Button ref={ref} variant="secondary" className={cn(className)} {...props}>
      {children}
    </Button>
  )
);
OutlineButton.displayName = "OutlineButton";

export { Button, buttonVariants, GlowButton, BeamButton, OutlineButton };
