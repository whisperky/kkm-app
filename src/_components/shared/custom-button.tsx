import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import { Button, ButtonProps } from "../ui/button";

type TImageProps = { icon?: string; name: string } | { icon?: undefined };

type TProps = {
  label?: string;
  color?: string;
} & ButtonProps &
  TImageProps;

export const ConnectButton = React.forwardRef<HTMLButtonElement, TProps>(
  ({ label, children, className, color = "#DADB0E", ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          "border-fades-sm font-semibold text-black/65 text-base font-made-tommy flex gap-4 justify-start tracking-wider h-auto",
          props?.size == "sm" && "sm_size",
          className
        )}
        color={color}
        {...props}
      >
        {props.icon && (
          <Image
            src={props.icon}
            alt={props.name}
            width={100}
            height={100}
            className="size-8 bg-white p-1 px-2 rounded-md"
          />
        )}
        <div
          className={cn(
            props.icon ? "pr-2" : props?.size == "sm" ? "px-1" : "px-2"
          )}
        >
          {label ?? children}
        </div>
      </Button>
    );
  }
);

ConnectButton.displayName = "ConnectButton";
