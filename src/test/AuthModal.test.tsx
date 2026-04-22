import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { AuthModal } from "../components/AuthModal";
import * as authApi from "../api/auth";

vi.mock("../store/auth-store", () => ({
  useAuthStore: () => ({ setAuth: vi.fn() }),
}));

describe("AuthModal - Login mode", () => {
  it("renders login form fields", () => {
    render(<AuthModal mode="login" onClose={vi.fn()} />);
    expect(screen.getByPlaceholderText("email@example.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••")).toBeInTheDocument();
    expect(screen.queryByPlaceholderText("Your name")).not.toBeInTheDocument();
  });

  it("shows error on failed login", async () => {
    vi.spyOn(authApi.authApi, "login").mockRejectedValueOnce(
      new Error("Invalid email or password")
    );

    render(<AuthModal mode="login" onClose={vi.fn()} />);
    fireEvent.change(screen.getByPlaceholderText("email@example.com"), {
      target: { value: "bad@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••"), {
      target: { value: "wrongpass" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText("Invalid email or password")).toBeInTheDocument();
    });
  });
});

describe("AuthModal - Register mode", () => {
  it("renders name field in register mode", () => {
    render(<AuthModal mode="register" onClose={vi.fn()} />);
    expect(screen.getByPlaceholderText("Your name")).toBeInTheDocument();
  });

  it("calls onClose after successful register", async () => {
    const onClose = vi.fn();
    vi.spyOn(authApi.authApi, "register").mockResolvedValueOnce({
      token: "tok123",
      user: { id: 1, name: "Alice", email: "alice@example.com" },
    });

    render(<AuthModal mode="register" onClose={onClose} />);
    fireEvent.change(screen.getByPlaceholderText("Your name"), {
      target: { value: "Alice" },
    });
    fireEvent.change(screen.getByPlaceholderText("email@example.com"), {
      target: { value: "alice@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });
});
