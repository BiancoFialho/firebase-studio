'use client';

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

import { cn } from "@/lib/utils"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider duration={3000}>
      {toasts.map(({ id, title, description, action, ...props }) => {
        return (
          <Toast
            key={id}
            {...props}
            className={cn(
              "group w-full max-w-md items-center rounded-md border-2 border-border bg-background p-4 shadow-md transition-all duration-300 ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-80 data-[state=open]:slide-in-from-bottom-full data-[state=closed]:slide-out-to-bottom-full data-[state=open]:sm:slide-in-from-bottom-3 data-[state=closed]:sm:slide-out-to-bottom-3",
            )}
          >
            <div className="grid w-full gap-1">
              {title && (
                <ToastTitle
                  className={cn("text-sm font-semibold", {
                    "mb-1": description,
                  })}
                >
                  {title}
                </ToastTitle>
              )}
              {description && <ToastDescription className="text-sm opacity-90">{description}</ToastDescription>}
            </div>
            {action && <div className="mt-2">{action}</div>}
            <ToastClose
              className="group absolute right-4 top-4 rounded-md opacity-0 transition-opacity hover:opacity-100 group-hover:opacity-100 focus:opacity-100"
              aria-label="Close"
            />
          </Toast>
        );
      })}
      <ToastViewport className="fixed z-[100] flex max-h-screen w-full flex-col-reverse gap-2 p-4 pointer-events-none sm:bottom-0 sm:right-0 sm:top-auto sm:left-auto" />
    </ToastProvider>
  );
}
