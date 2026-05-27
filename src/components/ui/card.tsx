import * as React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, elevated = false, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-[14px] text-[#fafafa] outline outline-[0.5px] outline-white/5",
        elevated
          ? "bg-[#262626] p-[24px] shadow-[0_9px_8px_rgba(0,0,0,0.25),0_6px_4px_-1px_rgba(0,0,0,0.25)]"
          : "bg-[#171717] p-[12px] shadow-[0_4px_12px_rgba(0,0,0,0.1)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> & { as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" }
>(({ className, as: Component = "h3", ...props }, ref) => (
  <Component
    ref={ref}
    className={cn(
      "text-[20px] font-medium leading-[1.3] tracking-[-0.01em] text-[#fafafa]",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-[13px] leading-[1.45] text-[#a3a3a3]", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("pt-4", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-4", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
