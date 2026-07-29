import Image from "next/image";
import Link from "next/link";

/*
 * Figma node 14:131. The mockup positions everything absolutely inside a
 * 1280x340 frame; here it is rebuilt with flow layout so it can collapse on
 * narrow screens. Measurements kept: 71px between the two link columns, 23px
 * between rows, 43px page gutter.
 *
 * The URLs come from the prototype links attached to the Figma text nodes —
 * except Orcid, which pointed at the private `my-orcid?orcid=` editing screen
 * and is normalised here to the public record.
 */
const discover = [
  { label: "Github", href: "https://github.com/kittyofheaven" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/hazelhandrata" },
  { label: "Orcid", href: "https://orcid.org/0009-0001-2720-0243" },
  { label: "Devpost", href: "https://devpost.com/kittyofheaven" },
];

const contact = [
  { label: "hazelhandrata@gmail.com", href: "mailto:hazelhandrata@gmail.com" },
  { label: "@hazelhandrata", href: "https://instagram.com/hazelhandrata" },
  { label: "857-xxxx-6168", href: null },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-foreground/15">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-[60px] px-6 py-[71px] sm:px-[43px]">
        <div className="flex flex-col gap-[48px] sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-[32px]">
            <span
              aria-label="Hazel Handrata"
              className="font-display text-[70px] leading-none tracking-[-29.4px] text-foreground"
            >
              HH
            </span>

            {/*
             * ChimeLab — one of Hazel's ventures. Taken from the black-background
             * quadrant of Artboard1_5 in the ChimeLab Figma file, with the
             * artboard's own #1E1E1E backdrop stripped so the mark sits directly
             * on the footer.
             */}
            <div className="flex flex-col gap-[11px]">
              <span className="text-[12px] text-foreground/40">Venture</span>
              <Image
                src="/design/chimelab.svg"
                alt="ChimeLab"
                width={2132}
                height={519}
                className="h-[36px] w-auto"
              />
            </div>
          </div>

          <div className="flex flex-col gap-[48px] sm:flex-row sm:gap-[71px]">
            <FooterColumn title="Discover" items={discover} underline />
            <FooterColumn title="Contact" items={contact} />
          </div>
        </div>

        <div className="flex flex-col gap-[11px] text-[12px]">
          <p>You imagine it. We build it.</p>
          <p>© 2026 Hazel Handrata</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  items,
  underline = false,
}: {
  title: string;
  items: { label: string; href: string | null }[];
  underline?: boolean;
}) {
  return (
    <div className="flex w-[200px] max-w-full flex-col gap-[23px]">
      <h2 className="text-[18px] font-bold">{title}</h2>
      {items.map(({ label, href }) =>
        href ? (
          <Link
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            className={`text-[12px] ${underline ? "underline decoration-from-font" : ""} hover:opacity-70`}
          >
            {label}
          </Link>
        ) : (
          <p key={label} className="text-[12px]">
            {label}
          </p>
        )
      )}
    </div>
  );
}
