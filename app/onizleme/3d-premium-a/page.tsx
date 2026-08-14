import { HybridDraft } from "../../taslaklar/DraftGallery";
import Premium3DStage from "../_premium3d/Premium3DStage";
import styles from "../_premium3d/stage.module.css";

/**
 * A — Sinematik koyu-altın.
 * Canlı ana sayfanın bileşeni, propları ve yerleşimi birebir aynıdır.
 * Fark yalnız arkadaki 3D sahne katmanındadır.
 */
export default function Premium3DAPage() {
  return (
    <main className={`${styles.stageRoot} ${styles.variantA}`}>
      <Premium3DStage variant="a" />
      <div className={styles.stageContent}>
        <HybridDraft live lumen previewFlow fullPreview showPreviewBadge={false} />
      </div>
    </main>
  );
}
