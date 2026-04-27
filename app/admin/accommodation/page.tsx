"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "@/assets/style/Admin/yogacourse/200hourscourse/Yoga200hr.module.css";
import api from "@/lib/api";
import toast from "react-hot-toast";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

interface MultiImgItem {
  id: string;
  file?: File;
  preview: string;
  serverPath?: string;
}

function SingleImg({ preview, badge, hint, error, onSelect, onRemove }: {
  preview: string; badge?: string; hint: string; error?: string;
  onSelect: (f: File, p: string) => void; onRemove: () => void;
}) {
  return (
    <div>
      <div className={`${styles.imageUploadZone} ${preview ? styles.hasImage : ""} ${error ? styles.inputError : ""}`}>
        {!preview ? (
          <>
            <input type="file" accept="image/*" onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) { onSelect(f, URL.createObjectURL(f)); e.target.value = ""; }
            }} />
            <div className={styles.imageUploadPlaceholder}>
              <span className={styles.imageUploadIcon}>🖼️</span>
              <span className={styles.imageUploadText}>Click to Upload</span>
              <span className={styles.imageUploadSub}>{hint}</span>
            </div>
          </>
        ) : (
          <div className={styles.imagePreviewWrap}>
            {badge && <span className={styles.imageBadge}>{badge}</span>}
            <img src={preview} alt="" className={styles.imagePreview} />
            <div className={styles.imagePreviewOverlay}>
              <span className={styles.imagePreviewAction}>✎ Change</span>
              <input type="file" accept="image/*" className={styles.imagePreviewOverlayInput}
                onChange={(e) => { const f = e.target.files?.[0]; if (f) { onSelect(f, URL.createObjectURL(f)); e.target.value = ""; } }} />
            </div>
            <button type="button" className={styles.removeImageBtn}
              onClick={(e) => { e.stopPropagation(); onRemove(); }}>✕</button>
          </div>
        )}
      </div>
      {error && <p className={styles.errorMsg}>⚠ {error}</p>}
    </div>
  );
}

export default function AccommodationManager() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageId, setPageId] = useState<string | null>(null);
  
  // Same as 500hr form - using MultiImgItem array
  const [accomImgs, setAccomImgs] = useState<MultiImgItem[]>([]);
  const [foodImgs, setFoodImgs] = useState<MultiImgItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get("/yoga-500hr/content");
        const data = res.data?.data;

        if (data?._id) {
          setPageId(data._id);
          
          // Load accommodation images exactly like 500hr form
          if (data.accomImages?.length) {
            setAccomImgs(data.accomImages.map((src: string, i: number) => ({ 
              id: `a${i}`, 
              preview: BASE_URL + src, 
              serverPath: src 
            })));
          }
          
          // Load food images exactly like 500hr form
          if (data.foodImages?.length) {
            setFoodImgs(data.foodImages.map((src: string, i: number) => ({ 
              id: `f${i}`, 
              preview: BASE_URL + src, 
              serverPath: src 
            })));
          }
        } else {
          toast.error("No 500hr page found. Create the page first.");
        }
      } catch (error) {
        console.error("Failed to fetch:", error);
        toast.error("Failed to load accommodation data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    if (!pageId) {
      toast.error("No page found. Please create the 500hr page first.");
      return;
    }

    setSaving(true);
    try {
      const fd = new FormData();
      
      // Same logic as 500hr form
      const keptAccomPaths = accomImgs.filter((img) => img.serverPath).map((img) => img.serverPath as string);
      fd.append("existingAccomImages", JSON.stringify(keptAccomPaths));
      accomImgs.forEach((img) => { if (img.file) fd.append("accomImage", img.file); });
      
      const keptFoodPaths = foodImgs.filter((img) => img.serverPath).map((img) => img.serverPath as string);
      fd.append("existingFoodImages", JSON.stringify(keptFoodPaths));
      foodImgs.forEach((img) => { if (img.file) fd.append("foodImage", img.file); });

      await api.put(`/yoga-500hr/content/update/${pageId}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Images updated successfully!");
      
      // Refresh to show updated images
      setTimeout(() => window.location.reload(), 1500);
    } catch (error: any) {
      console.error("Save error:", error);
      toast.error(error?.response?.data?.message || "Failed to save images");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingWrap}>
        <span className={styles.spinner} />
        <span>Loading accommodation data…</span>
      </div>
    );
  }

  return (
    <div className={styles.formPage}>
      <div className={styles.breadcrumb}>
        <button className={styles.breadcrumbLink} onClick={() => router.push("/admin")}>
          Dashboard
        </button>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>Accommodation & Food</span>
      </div>

      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderText}>
          <h1 className={styles.pageTitle}>Accommodation & Food Gallery</h1>
          <p className={styles.pageSubtitle}>
            Manage images for the accommodation and food sections on the 500hr page
          </p>
        </div>
      </div>

      <div className={styles.ornament}>
        <span>❧</span>
        <div className={styles.ornamentLine} />
        <span>ॐ</span>
        <div className={styles.ornamentLine} />
        <span>❧</span>
      </div>

      <div className={styles.formCard}>
        
        {/* Accommodation Images - Same as 500hr form */}
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>✦</span>
            <h3 className={styles.sectionTitle}>Accommodation Images</h3>
            <span className={styles.sectionBadge}>{accomImgs.length} images</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1rem" }}>
            {accomImgs.map((img) => (
              <div key={img.id} className={styles.fieldGroup}>
                <SingleImg
                  preview={img.preview}
                  badge="Accom"
                  hint="JPG/PNG/WEBP · 800×600px"
                  onSelect={(f, p) => {
                    const newItems = [...accomImgs];
                    const index = newItems.findIndex(i => i.id === img.id);
                    newItems[index] = { ...newItems[index], file: f, preview: p, serverPath: undefined };
                    setAccomImgs(newItems);
                  }}
                  onRemove={() => {
                    setAccomImgs(accomImgs.filter(i => i.id !== img.id));
                  }}
                />
              </div>
            ))}
          </div>
          <button type="button" className={styles.addItemBtn} onClick={() => {
            setAccomImgs([...accomImgs, { id: `a${Date.now()}`, preview: "", serverPath: undefined }]);
          }} style={{ marginTop: "1rem" }}>
            ＋ Add Accommodation Image
          </button>
        </div>

        <div style={{ margin: "2rem 0" }} />

        {/* Food Images - Same as 500hr form */}
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>✦</span>
            <h3 className={styles.sectionTitle}>Food Images</h3>
            <span className={styles.sectionBadge}>{foodImgs.length} images</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1rem" }}>
            {foodImgs.map((img) => (
              <div key={img.id} className={styles.fieldGroup}>
                <SingleImg
                  preview={img.preview}
                  badge="Food"
                  hint="JPG/PNG/WEBP · 800×600px"
                  onSelect={(f, p) => {
                    const newItems = [...foodImgs];
                    const index = newItems.findIndex(i => i.id === img.id);
                    newItems[index] = { ...newItems[index], file: f, preview: p, serverPath: undefined };
                    setFoodImgs(newItems);
                  }}
                  onRemove={() => {
                    setFoodImgs(foodImgs.filter(i => i.id !== img.id));
                  }}
                />
              </div>
            ))}
          </div>
          <button type="button" className={styles.addItemBtn} onClick={() => {
            setFoodImgs([...foodImgs, { id: `f${Date.now()}`, preview: "", serverPath: undefined }]);
          }} style={{ marginTop: "1rem" }}>
            ＋ Add Food Image
          </button>
        </div>

      </div>

      <div className={styles.formActions}>
        <Link href="/admin" className={styles.cancelBtn}>
          ← Back to Dashboard
        </Link>
        <button
          type="button"
          className={`${styles.submitBtn} ${saving ? styles.submitBtnLoading : ""}`}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <><span className={styles.spinner} /> Saving…</>
          ) : (
            <><span>✦</span> Save All Images</>
          )}
        </button>
      </div>
    </div>
  );
}