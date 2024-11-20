"use client";

import { cn } from "@/lib/utils";
import * as React from "react";

const Progress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value?: number }
>(({ className, value = 0, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props}>
    <span id="ProgressLabel" className="sr-only">
      Loading
    </span>
    <span
      role="progressbar"
      aria-labelledby="ProgressLabel"
      aria-valuenow={value}
      className="block rounded-full bg-[#00000033]"
    >
      <span
        className="block h-3 rounded-full bg-[#FFC204]"
        style={{ width: `${value}%` }}
      />
    </span>
  </div>
));
Progress.displayName = "Progress";

export { Progress };
