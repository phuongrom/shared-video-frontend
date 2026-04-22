import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { videosApi } from "../api/videos";
import { VideoCard } from "./VideoCard";

interface VideoListProps {
  refetchSignal?: number;
}

export function VideoList({ refetchSignal }: VideoListProps) {
  const [page, setPage] = useState(1);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["videos", page],
    queryFn: () => videosApi.list(page),
  });

  // Invalidate video cache when parent signals a new video was shared
  useEffect(() => {
    if (!refetchSignal) return;
    queryClient.invalidateQueries({ queryKey: ["videos"] });
    setPage(1); // Jump back to first page
  }, [refetchSignal, queryClient]);

  if (isLoading) return <div className="loading">Loading videos...</div>;
  if (isError) return <div className="error">Failed to load videos.</div>;
  if (!data?.videos.length) {
    return <div className="empty">No videos yet. Be the first to share!</div>;
  }

  const { pagination } = data;

  return (
    <section className="video-list">
      {data.videos.map((video) => (
        <VideoCard
          key={video.id}
          video={video}
          isPlaying={playingId === video.id}
          onPlay={() => setPlayingId(video.id)}
        />
      ))}

      {pagination.pages > 1 && (
        <div className="pagination">
          <button
            className="btn btn-outline"
            disabled={!pagination.prev}
            onClick={() => setPage((p) => p - 1)}
          >
            ← Prev
          </button>
          <span className="pagination-info">
            Page {pagination.page} / {pagination.pages}
          </span>
          <button
            className="btn btn-outline"
            disabled={!pagination.next}
            onClick={() => setPage((p) => p + 1)}
          >
            Next →
          </button>
        </div>
      )}
    </section>
  );
}
