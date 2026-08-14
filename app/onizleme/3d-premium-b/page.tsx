import { HybridDraft } from "../../taslaklar/DraftGallery";
import Premium3DStage from "../_premium3d/Premium3DStage";
import styles from "../_premium3d/stage.module.css";

/**
 * B — Temiz teknoloji/lüks, derinlik ve parallax.
 * Canlı ana sayfanın bileşeni, propları ve yerleşimi birebir aynıdır.
 * Fark yalnız arkadaki 3D sahne katmanı ve kontrollü hover hareketleridir.
 */
export default function Premium3DBPage() {
  return (
    <main className={`${styles.stageRoot} ${styles.variantB}`}>
      <Premium3DStage variant="b" />
      <div className={styles.stageContent}>
        <HybridDraft live lumen previewFlow fullPreview showPreviewBadge={false} />
      </div>
    </main>
  );
}
