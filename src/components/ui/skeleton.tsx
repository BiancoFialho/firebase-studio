import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted",
        "dark:bg-gray-700",
        "transition-colors duration-300",
        "ease-in-out",
        "hover:shadow-md",
        "focus:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-ring",
        "focus-visible:ring-offset-2",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
