import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "pill";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = "default", ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex w-full bg-transparent text-[#fafafa] border border-white/15 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#737373] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:bg-[#171717] disabled:cursor-not-allowed disabled:opacity-50",
          // The 5000s transition is a deliberate WebKit autofill flash suppression
          "transition-all duration-[5000s] ease-in-out",
          variant === "pill" 
            ? "rounded-full px-[16px] py-[10px] text-[16px]" 
            : "rounded-none px-[12px] py-[8px] text-[16px]",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
