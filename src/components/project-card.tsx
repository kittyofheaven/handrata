import Image from "next/image";
import Link from "next/link";

import { NavPill } from "@/components/nav-pill";
import type { Project } from "@/data/projects";
import { cn } from "@/lib/utils";

/*
 * Figma node 20:118, both variants. The mockup names its own layers "YANG INI
 * RATA KIRI" and "YANG INI RATA KANAN", so the left/right alternation is
 * deliberate rather than incidental.
 *
 * Measurements from the design: 1280x460 card, 60px gutter, 398px text column,
 * 30px between text blocks, 492x355 pattern panel holding a 249x149 image with
 * crosshair marks pinned to its opposite corners, and a 640px rule at y=400.
 *
 * Below `md` the two columns stack and `align` stops mattering — the design
 * only ever specified 1280px.
 */

type Props = {
  project: Project;
  index: number;
  align: "left" | "right";
};

export function ProjectCard({ project, index, align }: Props) {
  const right = align === "right";
  const number = String(index + 1).padStart(3, "0");

  return (
    <article
      className={cn(
        "relative mx-auto flex w-full max-w-[1280px] flex-col gap-10 px-6 py-12 sm:px-[60px] md:h-[460px] md:flex-row md:items-center md:gap-0 md:py-0",
        right && "md:flex-row-reverse"
      )}
    >
      <div
        className={cn(
          "flex w-full flex-col gap-[30px] md:w-[398px]",
          right && "md:items-end md:text-right"
        )}
      >
        <div className={cn("flex flex-col gap-[10px] md:w-[306px]")}>
          <p className="text-[12px] uppercase">
            {number}. {project.stack.join(" · ")}
          </p>
          <h2 className="text-[30px]">{project.title}</h2>
        </div>

        <p className="text-[12px] leading-[1.6]">{project.description}</p>

        <div className="flex items-center gap-[18px]">
          {project.url ? (
            <NavPill asChild>
              <Link href={project.url} target="_blank" rel="noreferrer">
                Github
              </Link>
            </NavPill>
          ) : (
            /*
             * Private repositories get a disabled pill instead of a link. The
             * URL is never rendered, so a visitor cannot reach a 404.
             */
            <NavPill disabled aria-label={`${project.title} — private repository`}>
              Private
            </NavPill>
          )}

          {project.homepage && (
            <NavPill filled asChild>
              <Link href={project.homepage} target="_blank" rel="noreferrer">
                Explore
              </Link>
            </NavPill>
          )}
        </div>
      </div>

      <PatternPanel
        project={project}
        variant={right ? "plus" : "dots"}
        align={align}
      />

      <div
        className={cn(
          "absolute bottom-0 hidden h-px w-[640px] bg-foreground md:block",
          right ? "right-[60px]" : "left-[60px]"
        )}
      />
    </article>
  );
}

function PatternPanel({
  project,
  variant,
  align,
}: {
  project: Project;
  variant: "dots" | "plus";
  align: "left" | "right";
}) {
  return (
    <div
      className={cn(
        "relative flex h-[240px] w-full items-center justify-center md:h-[355px] md:w-[492px]",
        align === "left" ? "md:ml-auto" : "md:mr-auto"
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0 text-foreground/25",
          variant === "dots" ? "pattern-dots" : "pattern-plus"
        )}
      />

      <div className="relative h-[149px] w-[249px]">
        {project.image ? (
          <Image
            src={project.image}
            alt={`${project.title} preview`}
            fill
            sizes="249px"
            className="object-cover"
          />
        ) : (
          /* No genuine preview exists for private work — show the frame only. */
          <div className="h-full w-full border border-foreground/25 bg-background" />
        )}

        <Crosshair className="-top-[20px] -left-[9px]" />
        <Crosshair className="-bottom-[20px] -right-[9px]" />
      </div>
    </div>
  );
}

function Crosshair({ className }: { className: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "absolute text-[25px] leading-none font-light select-none",
        className
      )}
    >
      +
    </span>
  );
}
