import type { Metadata } from "next";
import Link from "next/link";

import { archive } from "@/data/projects";

export const metadata: Metadata = {
  title: "Archive — Hazel Handrata",
  description:
    "Everything else: coursework, experiments, and older repositories, newest first.",
};

/*
 * Not in the Figma file — this page exists so the ten curated cards on
 * /projects stay a curation rather than a dump of 70 repositories. It borrows
 * the mockup's visual language: monospace, 12px, hairline rules between rows.
 *
 * Private repositories carry `url: null` from the sync script, so their rows
 * render as plain text and expose no link.
 */
export default function ArchivePage() {
  return (
    <section className="mx-auto w-full max-w-[1280px] px-6 pt-[230px] pb-[160px] sm:px-[60px]">
      <h1 className="text-center text-[18px] font-bold">Archive</h1>
      <p className="mt-[23px] text-center text-[12px] text-foreground/60">
        {archive.length} repositories, newest first. The ten on{" "}
        <Link
          href="/projects"
          className="underline decoration-from-font hover:opacity-70"
        >
          Projects
        </Link>{" "}
        are not repeated here.
      </p>

      <ul className="mt-[90px]">
        {archive.map((repo) => (
          <li
            key={repo.name}
            className="grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-[6px] border-t border-foreground/15 py-[18px] sm:grid-cols-[minmax(0,1fr)_140px_100px]"
          >
            <div className="col-span-full flex flex-col gap-[6px] sm:col-span-1">
              {repo.url ? (
                <Link
                  href={repo.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[12px] underline decoration-from-font hover:opacity-70"
                >
                  {repo.name}
                </Link>
              ) : (
                <span className="text-[12px]">
                  {repo.name}
                  <span className="ml-[9px] text-foreground/40">private</span>
                </span>
              )}

              {repo.description && (
                <p className="text-[12px] leading-[1.6] text-foreground/60">
                  {repo.description}
                </p>
              )}
            </div>

            <span className="text-[12px] text-foreground/60">
              {repo.language ?? "—"}
            </span>
            <span className="text-right text-[12px] text-foreground/60 tabular-nums">
              {repo.updatedAt.slice(0, 4)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
