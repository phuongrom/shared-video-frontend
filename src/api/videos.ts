import { api } from "./client";
import type { VideosResponse, Video } from "../types";

export const videosApi = {
  list: (page = 1) =>
    api.get<VideosResponse>(`/videos?page=${page}`),

  share: (url: string) =>
    api.post<{ video: Video }>("/videos", { url }),
};
