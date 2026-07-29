import type { Metadata } from "next";
import Link from "next/link";

import { AsciiArt } from "@/components/ascii-art";
import { ProjectCard } from "@/components/project-card";
import { archive, featured } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects — Hazel Handrata",
  description:
    "Selected work: motion sensing on WiFi CSI, webcam-based stress measurement, a personal finance app with receipt OCR, a facility booking platform, and more.",
};

/*
 * Figma node 12:65. The mockup stacks six Project Card instances 460px apart
 * under a "What I Build" heading at y=277; the cards alternate left/right by
 * position, which is reproduced here from the index.
 */
export default function ProjectsPage() {
  return (
    <>
      <AsciiArt
        variant="lattice"
        className="mx-auto mt-[92px] h-[280px] w-full max-w-[520px] md:h-[340px]"
      />

      <h1 className="mt-[57px] mb-[118px] text-center text-[18px] font-bold">
        What I Build
      </h1>

      <div>
        {featured.map((project, index) => (
          <ProjectCard
            key={project.title}
            project={project}
            index={index}
            align={index % 2 === 0 ? "left" : "right"}
          />
        ))}
      </div>

      <div className="mx-auto w-full max-w-[1280px] px-6 py-[120px] text-center sm:px-[60px]">
        <Link
          href="/projects/archive"
          className="text-[12px] underline decoration-from-font hover:opacity-70"
        >
          Archive — {archive.length} more repositories
        </Link>
      </div>
    </>
  );
}
