import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[4px] text-[14px] font-medium leading-[1.25] tracking-[-0.005em] transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-[#171717] text-[#ffffff] shadow-[0_0_2px_0.5px_rgba(0,0,0,0.2),0_0_4px_1px_rgba(0,0,0,0.1),0_0_8px_2px_rgba(0,0,0,0.05),0_0_0_0.5px_rgba(0,0,0,1),inset_0_0_0_1px_rgba(255,255,255,0.1),inset_0_0_3px_1px_rgba(255,255,255,0.1),inset_0_0.5px_0_0.5px_rgba(255,255,255,0.1)] hover:bg-[#000000] hover:scale-[1.02]",
        secondary:
          "bg-transparent text-[#fafafa] border border-white/10 hover:bg-[#262626]",
        ghost:
          "bg-transparent text-[#fafafa] hover:bg-[#262626]",
        link: 
          "text-[#fafafa] underline-offset-4 hover:underline",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        "gradient-action":
          "bg-[#ffffff] text-[#000000] font-semibold rounded-[10px] shadow-[0_9px_8px_rgba(0,0,0,0.2),0_6px_4px_-1px_rgba(0,0,0,0.2)] hover:bg-opacity-90",
      },
      size: {
        default: "px-[13px] py-[8px]",
        sm: "h-8 px-3 text-xs",
        lg: "h-11 px-8",
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
