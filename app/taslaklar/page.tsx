import DraftGallery from "./DraftGallery";

export const metadata = {
  title: "AgentAxis Labs | Ana Sayfa Taslakları",
  description: "AgentAxis Labs için hazırlanan üç özgün ana sayfa taslağı.",
  robots: { index: false, follow: false },
};

export default function DraftsPage() {
  return <DraftGallery />;
}
