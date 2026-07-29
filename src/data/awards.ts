/*
 * Awards & honors.
 *
 * LinkedIn itself cannot be fetched (it answers automated requests with HTTP
 * 999), so each entry below is reconstructed from a public source that can be
 * cited, and every one was cross-checked against a second source where one
 * exists:
 *
 *  - BOTcamp AI SDPPI — the LinkedIn honors entry, corroborated in detail by
 *    ITS' own write-up of the win (its.ac.id, team "Roro Jonggrang", first
 *    place in the Radio Frequency Spectrum category, announced 21 Dec 2023).
 *  - ARA 4.0 — LinkedIn honors entry (Top 5, Dec 2022 – Jan 2023).
 *  - PPTI 22 — the LinkedIn headline; the 2024 date is Hazel's own.
 *  - BCA Young Innovation Festival — supplied by Hazel (Nov 2025); it is not in
 *    any of the sources above.
 *  - Garuda Hacks 3.0, InfiniHacks, SyntHacks II — the winner badges on
 *    devpost.com/kittyofheaven and the individual project pages. No public
 *    source gives a date for SyntHacks II; its 2021 is Hazel's own.
 *
 * Ordered newest first. `year` is optional on the type because an entry may
 * arrive without a sourced date — a blank column beats a guessed one on a page
 * that claims to be a record of achievement. Every current entry has one.
 */

export type Award = {
  place: string;
  event: string;
  issuer: string;
  project?: string;
  year?: string;
};

export const awards: Award[] = [
  {
    place: "2nd Best",
    event: "BCA Young Innovation Festival — Kaizen Process",
    issuer: "Bank Central Asia",
    project: "Kaizen",
    year: "2025",
  },
  {
    place: "Scholarship Awardee",
    event: "PPTI 22",
    issuer: "Bank Central Asia",
    year: "2024",
  },
  {
    place: "1st Place",
    event: "UseCase BOTcamp AI SDPPI",
    issuer: "Kementerian Komunikasi dan Informatika RI",
    project: "OCR + NLP metadata extraction",
    year: "2023",
  },
  {
    place: "Top 5",
    event: "Olimpiade Cyber Security & IoT — ARA: A Renewal Agent 4.0",
    issuer: "Departemen Teknologi Informasi ITS",
    year: "2023",
  },
  {
    place: "Runner-up, Social Good",
    event: "Garuda Hacks 3.0",
    issuer: "Garuda Hacks",
    project: "MAKU",
    year: "2022",
  },
  {
    place: "Winner, Dream Big & Create More Cheers",
    event: "Garuda Hacks 3.0",
    issuer: "AB InBev",
    project: "MAKU",
    year: "2022",
  },
  {
    place: "Best Environment Hack",
    event: "InfiniHacks",
    issuer: "InfiniHacks",
    project: "Doom o'Clock",
    year: "2021",
  },
  {
    place: "3rd Place",
    event: "SyntHacks II",
    issuer: "SyntHacks",
    project: "Real Truth or Dare",
    year: "2021",
  },
];
