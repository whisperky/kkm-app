"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

import { cn } from "@/lib/utils";
import DialogContainer from "@/src/_components/shared/dialog-container";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  title?: any | React.JSX.Element | string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  isStoreBoard?: boolean;
  isClaimBoard?: boolean;
  containerClassName?: string;
  overlayProps?: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>;
  topImageClassName?: string;
  hideImage?: boolean;
  tabBarModal?: boolean;
  heightRatio?: number;
}

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(
  (
    {
      className,
      overlayProps,
      children,
      title,
      size,
      isStoreBoard,
      isClaimBoard,
      containerClassName,
      topImageClassName,
      hideImage,
      ...props
    },
    ref
  ) => (
    <DialogPortal>
      <DialogOverlay {...overlayProps} />
      <DialogPrimitive.Content
        ref={ref}
        // eslint-disable-next-line jsx-a11y/aria-props
        aria-describedby=""
        className={cn(
          `fixed px-3 left-[50%] border-none outline-none top-1/2 ${
            isStoreBoard || isClaimBoard
              ? "mt-0"
              : size === "sm"
              ? "mt-[-75px]"
              : "mt-[-50px]"
          } z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg`,
          className
        )}
        style={{
          transform: props.tabBarModal
            ? `translate(-50%, -50%) scale(${props.heightRatio})`
            : "translate(-50%, -50%)",
        }}
        {...props}
      >
        <DialogContainer
          title={title}
          size={size}
          isStoreBoard={isStoreBoard}
          isClaimBoard={isClaimBoard}
          topImageClassName={topImageClassName}
          className={cn(containerClassName)}
          hideImage={hideImage}
          tabBarModal={props.tabBarModal}
        >
          {children}
        </DialogContainer>
      </DialogPrimitive.Content>
    </DialogPortal>
  )
);
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
