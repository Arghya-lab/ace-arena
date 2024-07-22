"use client";

import {
  Toast,
  ToastMessage,
  ToastProvider,
  ToastViewport,
} from "@/components/ui/toast";
import { useToast } from "@/hooks/useToast";
import { AnimatePresence, motion } from "framer-motion";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      <AnimatePresence>
        {toasts.map(function ({ id, title, message, action, ...props }) {
          return (
            <Toast {...props} key={id}>
              {message && (
                <motion.div
                  key={id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="grid gap-1">
                    <ToastMessage>{message}</ToastMessage>
                  </div>
                  {action}
                </motion.div>
              )}
            </Toast>
          );
        })}
      </AnimatePresence>
      <ToastViewport />
    </ToastProvider>
  );
}
