"use client"
import React from "react";
import { X } from "@/lib/icons";
import { Button } from "@/components/ui/button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  showCloseButton?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showCloseButton = true,
}: ModalProps) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className={`relative bg-popover border border-secondary-foreground rounded-sm shadow-[0_0_16px_rgba(139, 92, 246,0.15)] w-full mx-4 ${sizeClasses[size]} max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-300`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-popover border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-hanken font-bold text-foreground">{title}</h2>
          {showCloseButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 text-secondary-foreground hover:text-primary hover:bg-transparent cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          {children}
        </div>
      </div>
    </div>
  );
}
