import type { Video } from "../types";

interface VideoCardProps {
  video: Video;
  isPlaying: boolean;
  onPlay: () => void;
}

export function VideoCard({ video, isPlaying, onPlay }: VideoCardProps) {
  const embedUrl = `https://www.youtube.com/embed/${video.youtube_id}?autoplay=1`;

  return (
    <article className="video-card">
      <div className="video-embed">
        {isPlaying ? (
          <iframe
            src={embedUrl}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button className="video-thumbnail-btn" onClick={onPlay} aria-label={`Play ${video.title}`}>
            <img src={video.thumbnail_url} alt={video.title} />
            <span className="play-icon">▶</span>
          </button>
        )}
      </div>

      <div className="video-info">
        <h3 className="video-title">
          <a href={video.url} target="_blank" rel="noopener noreferrer">
            {video.title}
          </a>
        </h3>
        <p className="video-meta">
          Shared by: <strong>{video.shared_by.name}</strong>
          <span className="video-meta-email"> ({video.shared_by.email})</span>
        </p>
        {video.description && (
          <p className="video-description">{video.description}</p>
        )}
      </div>
    </article>
  );
}
