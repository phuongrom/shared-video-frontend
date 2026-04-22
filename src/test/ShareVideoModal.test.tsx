import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { ShareVideoModal } from "../components/ShareVideoModal";
import * as videosApi from "../api/videos";

describe("ShareVideoModal", () => {
  it("renders URL input", () => {
    render(<ShareVideoModal onClose={vi.fn()} onSuccess={vi.fn()} />);
    expect(screen.getByPlaceholderText(/youtube\.com/i)).toBeInTheDocument();
  });

  it("calls onSuccess after successful share", async () => {
    const onSuccess = vi.fn();
    vi.spyOn(videosApi.videosApi, "share").mockResolvedValueOnce({
      video: {
        id: 1,
        title: "Rick Astley",
        youtube_id: "dQw4w9WgXcQ",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        thumbnail_url: "",
        description: null,
        shared_by: { id: 1, name: "Alice", email: "alice@example.com" },
        created_at: "2026-04-15T00:00:00Z",
      },
    });

    render(<ShareVideoModal onClose={vi.fn()} onSuccess={onSuccess} />);
    fireEvent.change(screen.getByPlaceholderText(/youtube\.com/i), {
      target: { value: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    });
    fireEvent.click(screen.getByRole("button", { name: /share/i }));

    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
  });

  it("shows error on failed share", async () => {
    vi.spyOn(videosApi.videosApi, "share").mockRejectedValueOnce(
      new Error("Invalid YouTube URL")
    );

    render(<ShareVideoModal onClose={vi.fn()} onSuccess={vi.fn()} />);
    fireEvent.change(screen.getByPlaceholderText(/youtube\.com/i), {
      target: { value: "https://example.com/not-youtube" },
    });
    fireEvent.click(screen.getByRole("button", { name: /share/i }));

    await waitFor(() => {
      expect(screen.getByText("Invalid YouTube URL")).toBeInTheDocument();
    });
  });
});
