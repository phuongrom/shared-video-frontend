import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { Header } from "../components/Header";

const mockClearAuth = vi.fn();

vi.mock("../components/AuthModal", () => ({
  AuthModal: ({ mode, onClose }: { mode: string; onClose: () => void }) => (
    <div data-testid="auth-modal" data-mode={mode}>
      <button onClick={onClose}>close</button>
    </div>
  ),
}));

vi.mock("../components/ShareVideoModal", () => ({
  ShareVideoModal: ({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) => (
    <div data-testid="share-modal">
      <button onClick={onClose}>close</button>
      <button onClick={onSuccess}>success</button>
    </div>
  ),
}));

vi.mock("../store/auth-store", () => ({
  useAuthStore: vi.fn(),
}));

import { useAuthStore } from "../store/auth-store";

describe("Header - unauthenticated", () => {
  beforeEach(() => {
    (useAuthStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      isAuthenticated: false,
      user: null,
      clearAuth: mockClearAuth,
    });
  });

  it("shows Login and Register buttons", () => {
    render(<Header onVideoShared={vi.fn()} />);
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /register/i })).toBeInTheDocument();
  });

  it("opens login modal when Login is clicked", () => {
    render(<Header onVideoShared={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /login/i }));
    expect(screen.getByTestId("auth-modal")).toHaveAttribute("data-mode", "login");
  });

  it("opens register modal when Register is clicked", () => {
    render(<Header onVideoShared={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /register/i }));
    expect(screen.getByTestId("auth-modal")).toHaveAttribute("data-mode", "register");
  });
});

describe("Header - authenticated", () => {
  beforeEach(() => {
    (useAuthStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      isAuthenticated: true,
      user: { id: 1, name: "Alice", email: "alice@example.com" },
      clearAuth: mockClearAuth,
    });
  });

  it("shows welcome message with user name", () => {
    render(<Header onVideoShared={vi.fn()} />);
    expect(screen.getByText(/welcome, alice/i)).toBeInTheDocument();
  });

  it("shows Share and Logout buttons", () => {
    render(<Header onVideoShared={vi.fn()} />);
    expect(screen.getByRole("button", { name: /share a movie/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();
  });

  it("calls clearAuth when Logout is clicked", () => {
    render(<Header onVideoShared={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /logout/i }));
    expect(mockClearAuth).toHaveBeenCalled();
  });

  it("opens share modal when Share is clicked", () => {
    render(<Header onVideoShared={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /share a movie/i }));
    expect(screen.getByTestId("share-modal")).toBeInTheDocument();
  });

  it("calls onVideoShared when share succeeds", () => {
    const onVideoShared = vi.fn();
    render(<Header onVideoShared={onVideoShared} />);
    fireEvent.click(screen.getByRole("button", { name: /share a movie/i }));
    fireEvent.click(screen.getByRole("button", { name: /success/i }));
    expect(onVideoShared).toHaveBeenCalled();
  });
});
