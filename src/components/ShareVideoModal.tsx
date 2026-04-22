import { useState, useEffect, useRef } from "react";
import { videosApi } from "../api/videos";

interface ShareVideoModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface VideoPreview {
  title: string;
  thumbnail_url: string;
}

function extractYoutubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

async function fetchPreview(url: string): Promise<VideoPreview | null> {
  try {
    const res = await fetch(
      `https://noembed.com/embed?url=${encodeURIComponent(url)}`
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (data.error || !data.title) return null;
    return { title: data.title, thumbnail_url: data.thumbnail_url };
  } catch {
    return null;
  }
}

export function ShareVideoModal({ onClose, onSuccess }: ShareVideoModalProps) {
  const [url, setUrl] = useState("");
  const [preview, setPreview] = useState<VideoPreview | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-fetch title when URL changes
  useEffect(() => {
    setPreview(null);

    if (!extractYoutubeId(url)) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    setPreviewLoading(true);
    debounceRef.current = setTimeout(async () => {
      const result = await fetchPreview(url);
      setPreview(result);
      setPreviewLoading(false);
    }, 600);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [url]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await videosApi.share(url);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to share video");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Share a YouTube Video</h2>

        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label>YouTube URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              required
            />
          </div>

          {/* Live preview */}
          {previewLoading && (
            <p className="preview-loading">Đang tải thông tin video...</p>
          )}
          {preview && !previewLoading && (
            <div className="video-preview">
              {preview.thumbnail_url && (
                <img src={preview.thumbnail_url} alt={preview.title} />
              )}
              <p className="preview-title">{preview.title}</p>
            </div>
          )}

          {error && <p className="error-message">{error}</p>}

          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Sharing..." : "Share"}
            </button>
          </div>
        </form>

        <button className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>
      </div>
    </div>
  );
}
