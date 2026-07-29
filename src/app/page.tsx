import Image from "next/image";

import { AsciiArt } from "@/components/ascii-art";
import { awards } from "@/data/awards";

/*
 * Figma node 4:15. The hero title sits at y=280 with the mountain artwork as a
 * 1920px-wide bleed beneath it — in the mockup that artwork is the photo with
 * ASCII layered over the top, which is reproduced here. The photo's sky is
 * transparent, so it composites straight onto the page background.
 *
 * The design then leaves roughly 2900px empty between "The Tools Behind My
 * Work" and the footer; the skillset and stack sections below fill it. Both are
 * drawn from the actual repositories and the tools named in the About story.
 */

const skillset = [
  {
    label: "Machine Learning & Computer Vision",
    detail:
      "Pulse and emotion inference from ordinary video, receipt OCR with transformer models, on-device face recognition.",
  },
  {
    label: "Data Mining",
    detail:
      "End-to-end KDD pipelines — preprocessing, clustering, association rules, anomaly detection on real credit-risk data.",
  },
  {
    label: "Full-Stack Web",
    detail:
      "Dashboards and booking flows on Next.js, REST APIs in Laravel and FastAPI, realtime sync over WebSockets.",
  },
  {
    label: "Mobile Development",
    detail:
      "Native Android in Kotlin and iOS in SwiftUI, from finance tracking to camera-driven apps.",
  },
  {
    label: "Embedded & Signal Processing",
    detail:
      "Motion sensing from WiFi channel state on a bare ESP32, using adaptive detection and rank correlation.",
  },
];

const stack = [
  {
    label: "Languages",
    items: [
      "Python",
      "TypeScript",
      "JavaScript",
      "Swift",
      "Java",
      "Kotlin",
      "C / C++",
      "PHP",
    ],
  },
  {
    label: "Machine Learning",
    items: ["TensorFlow", "Hugging Face", "OpenCV", "scikit-learn", "Jupyter"],
  },
  {
    label: "Web",
    items: [
      "Next.js",
      "React",
      "Django",
      "Flask",
      "FastAPI",
      "Laravel",
      "Tailwind",
    ],
  },
  {
    label: "Mobile & Embedded",
    items: ["SwiftUI", "Android / Kotlin", "ESP32"],
  },
  {
    label: "Data & Infra",
    items: ["MySQL", "Docker", "Azure Blob", "WebSockets"],
  },
];

export default function Home() {
  return (
    <>
      <section className="flex flex-col items-center">
        <h1 className="mt-[233px] px-6 text-center text-[18px] font-bold">
          Hi, I&rsquo;m Hazel | Software Engineer
        </h1>

        <div className="mt-[35px] flex flex-col items-center gap-[14px]">
          <span className="text-[12px] text-foreground/40">powering</span>
          <Image
            src="/design/chimelab.svg"
            alt="ChimeLab"
            width={2132}
            height={519}
            priority
            className="h-[36px] w-auto md:h-[46px]"
          />
        </div>

        {/*
          * Full-bleed, as in the design. The box carries the photo's own
          * aspect (1600x758, after its empty sky was cropped off), so the
          * image reaches both screen edges and still loses nothing — a fixed
          * height would force a choice between gaps at the sides and a
          * cropped summit.
          */}
        <div className="relative left-1/2 mt-[60px] aspect-[1600/758] w-screen -translate-x-1/2">
          <Image
            src="/design/mountain.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* ASCII layered over the photo, exactly as the mockup stacks them. */}
          <AsciiArt
            variant="terrain"
            src="/design/mountain.png"
            className="absolute inset-0"
          />
        </div>
      </section>

      {/*
        * Awards leads, then Skillset. Both use the same numbered-row language;
        * the only difference is that Awards carries a trailing year column, and
        * a couple of entries have no sourced date, so that cell simply stays
        * empty instead of guessing.
        */}
      <section className="mx-auto w-full max-w-[1280px] px-6 pt-[180px] sm:px-[60px]">
        <h2 className="text-center text-[18px] font-bold">Awards</h2>

        <ol className="mt-[90px]">
          {awards.map(({ place, event, issuer, project, year }, index) => (
            <li
              key={`${event}-${place}`}
              className="grid grid-cols-1 gap-[11px] border-t border-foreground/15 py-[30px] md:grid-cols-[80px_minmax(0,320px)_minmax(0,1fr)_60px] md:gap-[30px]"
            >
              <span className="text-[12px] text-foreground/40 tabular-nums">
                {String(index + 1).padStart(3, "0")}.
              </span>
              <h3 className="text-[12px] font-bold">{place}</h3>
              <p className="text-[12px] leading-[1.6] text-foreground/60">
                {event}
                <span className="text-foreground/40">
                  {" — "}
                  {issuer}
                  {project ? ` · ${project}` : ""}
                </span>
              </p>
              <span className="text-[12px] tabular-nums text-foreground/40 md:text-right">
                {year ?? ""}
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto w-full max-w-[1280px] px-6 pt-[180px] sm:px-[60px]">
        <h2 className="text-center text-[18px] font-bold">Skillset</h2>

        <ol className="mt-[90px]">
          {skillset.map(({ label, detail }, index) => (
            <li
              key={label}
              className="grid grid-cols-1 gap-[11px] border-t border-foreground/15 py-[30px] md:grid-cols-[80px_minmax(0,320px)_minmax(0,1fr)] md:gap-[30px]"
            >
              <span className="text-[12px] text-foreground/40 tabular-nums">
                {String(index + 1).padStart(3, "0")}.
              </span>
              <h3 className="text-[12px] font-bold">{label}</h3>
              <p className="text-[12px] leading-[1.6] text-foreground/60">
                {detail}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto w-full max-w-[1280px] px-6 pt-[180px] pb-[200px] sm:px-[60px]">
        <h2 className="text-center text-[18px] font-bold">
          The Tools Behind My Work
        </h2>

        <dl className="mt-[90px] grid grid-cols-1 gap-[60px] sm:grid-cols-2 lg:grid-cols-3">
          {stack.map(({ label, items }) => (
            <div
              key={label}
              className="flex flex-col gap-[23px] border-t border-foreground/15 pt-[23px]"
            >
              <dt className="text-[12px] uppercase text-foreground/60">
                {label}
              </dt>
              <dd className="flex flex-col gap-[11px]">
                {items.map((item) => (
                  <span key={item} className="text-[12px]">
                    {item}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}
