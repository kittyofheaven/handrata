import type { Metadata } from "next";

import { AsciiArt } from "@/components/ascii-art";

export const metadata: Metadata = {
  title: "About — Hazel Handrata",
  description:
    "How a kid looking for a book about line-tracing robots ended up building AI-powered web apps.",
};

/*
 * Figma node 12:82. Copy is transcribed from text nodes 24:1521 and 24:1525 —
 * it is Hazel's own writing, not a paraphrase. The mockup renders it as one
 * text block each; the paragraph splits below follow the line breaks visible in
 * the design.
 *
 * One deliberate departure: the opening line spells out a full legal name in
 * the design. It is shortened to "Hazel Handrata" here, at Hazel's request, so
 * the public site carries less identifying detail.
 */
const story = [
  "Glad you're here, my name is Hazel Handrata and this is my story.",
  "It all started when I was young. I love robots and started looking for a book that can explain to me how to build a robot, but robots have many meanings back then. I find a book about how to build a line-tracing robot but I know that's not what I want. I want something more, I want something big. Took me long enough until I know what I love and what I really want to build back then. I want to build an AI sort of like a Jarvis in Iron Man movies.",
  'While in 8th grade I started to learn programming language for web development, in 9th grade I started learning Python because I know many of the machine learning projects were written in Python then I took the "TensorFlow Developer Certificate: Zero to Mastery" course by ZTM on udemy. Since then I feel like I can\'t get enough. I always love programming, I joined many hackathon competitions just to test my skill in the real world. Many of these hackathons forced me to learn web development frameworks, while I can program in Python so I choose Python web development frameworks (Django, Flask, Fast API).',
  "Programming and software development call to all my passion. it incorporates problem-solving, creativity, and patience. I love breaking down the logic behind a program.",
];

const aboutMyCode = [
  "I build clean, minimal, and practical websites with a focus on performance, maintainable code, and smooth user experience. I enjoy turning ideas into polished digital products, from landing pages and dashboards to automation tools and AI-powered web apps.",
  "If you have an idea or project you want to build, feel free to contact me.",
];

export default function AboutPage() {
  return (
    <>
      <AsciiArt
        variant="figure"
        className="mx-auto mt-[92px] h-[380px] w-full max-w-[620px] md:h-[495px]"
      />

      <section className="mx-auto w-full max-w-[613px] px-6 pt-[57px]">
        <h1 className="text-center text-[18px] font-bold">
          Hi, I&rsquo;m Hazel Handrata
        </h1>
        <div className="mt-[35px] flex flex-col gap-[23px]">
          {story.map((paragraph) => (
            <p
              key={paragraph.slice(0, 32)}
              className="text-center text-[12px] leading-[1.6]"
            >
              {paragraph}
            </p>
          ))}
        </div>

        <h2 className="mt-[60px] text-center text-[18px] font-bold">
          About My Code
        </h2>
        <div className="mt-[35px] flex flex-col gap-[23px]">
          {aboutMyCode.map((paragraph) => (
            <p
              key={paragraph.slice(0, 32)}
              className="text-center text-[12px] leading-[1.6]"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section className="flex h-[606px] items-center justify-center px-6">
        <p className="text-center text-[18px] font-bold tracking-[0.06em]">
          YOU IMAGINE IT. WE BUILD IT
        </p>
      </section>
    </>
  );
}
