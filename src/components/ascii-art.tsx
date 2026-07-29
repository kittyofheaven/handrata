"use client";

import dynamic from "next/dynamic";

import type { AsciiVariant } from "@/components/ascii-scene";

/*
 * `ssr: false` is only honoured inside a Client Component in Next 16, so the
 * dynamic import is isolated here and the pages import this wrapper instead of
 * the scene directly. Three.js touches `window` on import, so it must not be
 * prerendered.
 */
const AsciiScene = dynamic(() => import("@/components/ascii-scene"), {
  ssr: false,
  loading: () => (
    <pre
      aria-hidden="true"
      className="flex h-full w-full items-center justify-center text-[10px] leading-none text-foreground/25"
    >
      {`  .:-=+*#%@%*+=-:.  \n .-=+*#%@@@%#*+=-. \n:-=+*#%@@@@@%#*+=-:`}
    </pre>
  ),
});

export function AsciiArt(props: {
  variant: AsciiVariant;
  src?: string;
  className?: string;
}) {
  return <AsciiScene {...props} />;
}
