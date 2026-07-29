import { repos, type Repo } from "@/data/repos.generated";

export type Project = {
  /** Display title. Repo names like `znapit-backend` don't read as titles. */
  title: string;
  description: string;
  /** Repos this project spans. Several are split across a frontend/backend/ML trio. */
  repos: string[];
  /** Primary link. `null` for private work — never link a visitor to a 404. */
  url: string | null;
  /** Live deployment, when there is one. */
  homepage: string | null;
  isPrivate: boolean;
  /** Preview art. Omitted where no genuine image exists — the card then shows
   *  only its pattern grid rather than a fabricated screenshot. */
  image: string | null;
  stack: string[];
};

const ogImage = (repo: string) =>
  `https://opengraph.githubassets.com/1/kittyofheaven/${repo}`;

/*
 * The ten cards on /projects, in the order they appear. Descriptions are taken
 * from each repo's own README or GitHub description; where a repo had neither,
 * the text is written from reading the source and is marked in the review notes
 * so it can be corrected.
 */
export const featured: Project[] = [
  {
    title: "WiFi CSI Motion Detection",
    description:
      "Motion detection built on WiFi Channel State Information from a low-cost ESP32, using adaptive state-based detection with Spearman correlation. Includes the host-side pipeline, the experimental data, and the paper.",
    repos: ["csi-esp32-motion-detection"],
    url: "https://github.com/kittyofheaven/csi-esp32-motion-detection",
    homepage: null,
    isPrivate: false,
    image: ogImage("csi-esp32-motion-detection"),
    stack: ["ESP32", "Python", "LaTeX"],
  },
  {
    title: "Webcam Stress Meter",
    description:
      "An AI that reads your heart rate, emotions, and stress level from nothing but a webcam feed. Built as a replacement for a pomodoro timer — when the stress meter climbs high enough, it tells you to take a break.",
    repos: ["Webcam-Stress-Meter"],
    url: null,
    homepage: null,
    isPrivate: true,
    image: null,
    stack: ["Python", "Computer Vision", "rPPG"],
  },
  {
    title: "MonkeysLimit",
    description:
      "A personal finance companion for Android that tracks, budgets, splits, and analyses spending. Receipts are scanned by a FastAPI service running a Hugging Face Donut OCR model, with a smart-flatten post-processor and a TF-IDF classifier sorting the extracted text.",
    repos: [
      "Monkeyslimit",
      "MonkeysLimitFE",
      "monkeylimitsBackend",
      "monkeylimitsML",
    ],
    url: "https://github.com/kittyofheaven/Monkeyslimit",
    homepage: null,
    isPrivate: false,
    image: ogImage("Monkeyslimit"),
    stack: ["Kotlin", "FastAPI", "Donut OCR", "TF-IDF"],
  },
  {
    title: "RTB Connect",
    description:
      "A facility booking platform for communal rooms, community work spaces, kitchens, and washing machines. Pairs a management dashboard with a self-service booking flow, backed by a REST API that drives live availability, smart time-slot selection, and role-aware access.",
    repos: ["kaizenfe", "kaizenbe", "kaizensuper"],
    url: "https://github.com/kittyofheaven/kaizenfe",
    homepage: null,
    isPrivate: false,
    image: ogImage("kaizenfe"),
    stack: ["Next.js", "TypeScript", "REST API"],
  },
  {
    title: "Home Credit Default Risk",
    description:
      "A full data-mining pipeline over the Home Credit Default Risk dataset — preprocessing, clustering, association rules, and anomaly detection, following the KDD process end to end.",
    repos: ["Data-Mining-for-Home-Credit-Default-Risk"],
    url: null,
    homepage: null,
    isPrivate: true,
    image: null,
    stack: ["Python", "Jupyter", "KDD"],
  },
  {
    title: "Znapit",
    description:
      "A web-based photo booth. Capture from the device camera, pick a frame layout, apply effects and stickers, and composite the result into a photostrip. Three capture modes — Normal, Finger Framing, and Photo Collab — the last syncing two devices in realtime over WebSockets.",
    repos: ["znapit-backend"],
    url: null,
    homepage: null,
    isPrivate: true,
    image: null,
    stack: ["Laravel", "MySQL", "Reverb", "Azure Blob"],
  },
  {
    title: "Doom o'Clock",
    description:
      "A countdown to when the earth ends, paired with a prediction of greenhouse gas emissions driving it there.",
    repos: ["doom-o-clock"],
    url: "https://github.com/kittyofheaven/doom-o-clock",
    homepage: "https://doom-o-clock.theohalpern.repl.co/",
    isPrivate: false,
    image: ogImage("doom-o-clock"),
    stack: ["HTML", "JavaScript"],
  },
  {
    title: "Real Truth or Dare",
    description:
      "Truth or dare with the bluffing removed — a web-based lie detector judges whether you actually told the truth.",
    repos: ["Real-Truth-or-Dare"],
    url: "https://github.com/kittyofheaven/Real-Truth-or-Dare",
    homepage: null,
    isPrivate: false,
    image: ogImage("Real-Truth-or-Dare"),
    stack: ["Python", "Jupyter", "Web"],
  },
  {
    title: "Remote PPG",
    description:
      "Remote photoplethysmography for PKM 2024: recovering a pulse signal from ordinary video by measuring the colour shifts blood flow leaves in skin. The measurement layer underneath the stress meter.",
    repos: ["PKM2024remotePPG"],
    url: null,
    homepage: null,
    isPrivate: true,
    image: null,
    stack: ["Python", "Signal Processing"],
  },
  {
    title: "Face Recognition SwiftUI",
    description:
      "Face recognition running natively on iOS, wrapped in a SwiftUI interface — camera capture, detection, and identification on device.",
    repos: ["Face-Recognition-SwiftUI"],
    url: "https://github.com/kittyofheaven/Face-Recognition-SwiftUI",
    homepage: null,
    isPrivate: false,
    image: ogImage("Face-Recognition-SwiftUI"),
    stack: ["Swift", "SwiftUI", "Vision"],
  },
];

/** Every repo not already represented by a featured card. */
const featuredRepoNames = new Set(featured.flatMap((p) => p.repos));

export const archive: Repo[] = repos.filter(
  (repo) => !featuredRepoNames.has(repo.name)
);
