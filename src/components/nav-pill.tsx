import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/*
 * The `ButtonNav` component from Figma (node 12:13): a 98x35 pill with a 20px
 * radius, in two variants — filled white, or outlined on the page background.
 * Both the navbar and the project cards use it, so the geometry lives here
 * once.
 */
const pillBase =
  "h-[35px] w-[98px] rounded-[20px] px-[20px] py-[10px] text-[12px] font-normal";

type NavPillProps = React.ComponentProps<typeof Button> & {
  filled?: boolean;
};

export function NavPill({
  filled = false,
  className,
  ...props
}: NavPillProps) {
  return (
    <Button
      variant={filled ? "default" : "outline"}
      className={cn(
        pillBase,
        filled
          ? "bg-primary text-primary-foreground hover:bg-primary/85"
          : "border-foreground bg-transparent text-foreground hover:bg-foreground/10 hover:text-foreground",
        className
      )}
      {...props}
    />
  );
}

export { pillBase };
