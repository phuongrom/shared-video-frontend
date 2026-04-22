import { render, screen } from "@testing-library/react";
import { VideoCard } from "../components/VideoCard";
import type { Video } from "../types";

const mockVideo: Video = {
  id: 1,
  title: "Test Video Title",
  youtube_id: "dQw4w9WgXcQ",
  url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  thumbnail_url: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
  description: "A great video",
  shared_by: { id: 1, name: "Alice", email: "alice@example.com" },
  created_at: "2026-04-15T00:00:00Z",
};

const noop = () => {};

describe("VideoCard", () => {
  it("renders video title", () => {
    render(<VideoCard video={mockVideo} isPlaying={false} onPlay={noop} />);
    expect(screen.getByText("Test Video Title")).toBeInTheDocument();
  });

  it("renders shared_by user name", () => {
    render(<VideoCard video={mockVideo} isPlaying={false} onPlay={noop} />);
    expect(screen.getByText("Alice")).toBeInTheDocument();
  });

  it("shows thumbnail button when not playing", () => {
    render(<VideoCard video={mockVideo} isPlaying={false} onPlay={noop} />);
    expect(screen.getByRole("button", { name: /play test video title/i })).toBeInTheDocument();
  });

  it("renders iframe when playing", () => {
    render(<VideoCard video={mockVideo} isPlaying={true} onPlay={noop} />);
    const iframe = screen.getByTitle("Test Video Title");
    expect(iframe).toHaveAttribute(
      "src",
      "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
    );
  });

  it("renders description when present", () => {
    render(<VideoCard video={mockVideo} isPlaying={false} onPlay={noop} />);
    expect(screen.getByText("A great video")).toBeInTheDocument();
  });

  it("does not render description when absent", () => {
    render(<VideoCard video={{ ...mockVideo, description: null }} isPlaying={false} onPlay={noop} />);
    expect(screen.queryByText("A great video")).not.toBeInTheDocument();
  });
});
