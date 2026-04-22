export interface User {
  id: number;
  email: string;
  name: string;
}

export interface Video {
  id: number;
  title: string;
  youtube_id: string;
  url: string;
  thumbnail_url: string;
  description: string | null;
  shared_by: User;
  created_at: string;
}

export interface Pagination {
  count: number;
  page: number;
  items: number;
  pages: number;
  last: number;
  next: number | null;
  prev: number | null;
}

export interface VideosResponse {
  videos: Video[];
  pagination: Pagination;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Notification {
  id: string;
  type: "new_video";
  video_id: number;
  video_title: string;
  thumbnail_url: string;
  shared_by: string;
  shared_by_email: string;
  created_at: string;
}
