import { type ButtonHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "danger";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-ink text-vellum hover:bg-ink/90",
  secondary: "bg-transparent text-ink border border-ink/30 hover:border-ink",
  danger: "bg-seal text-vellum hover:bg-seal-dark",
};

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; loading?: boolean }
>(({ className, variant = "primary", loading, disabled, children, ...props }, ref) => (
  <button
    ref={ref}
    disabled={disabled || loading}
    className={clsx(
      "inline-flex items-center justify-center gap-2 rounded-sm px-5 py-2.5",
      "font-serif text-[15px] tracking-wide transition-colors duration-150",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass",
      VARIANT_CLASSES[variant],
      className
    )}
    {...props}
  >
    {loading && (
      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
    )}
    {children}
  </button>
));
Button.displayName = "Button";
