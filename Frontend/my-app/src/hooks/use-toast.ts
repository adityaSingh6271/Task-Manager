"use client"

import { toast as sonnerToast } from "sonner"

export function useToast() {
  return {
    toast: (opts: { title?: string; description?: string; variant?: "default" | "destructive" }) => {
      sonnerToast(opts.title || "Notification", {
        description: opts.description,
        className:
          opts.variant === "destructive"
            ? "bg-red-500 text-white dark:bg-red-600"
            : "",
      })
    },
  }
}
