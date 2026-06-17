import { render, screen, waitFor, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Dashboard } from "./Dashboard";
import { api } from "../infra/http/api";

vi.mock("../infra/http/api", () => ({
  api: {
    get: vi.fn(),
  },
}));

describe("Dashboard Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    cleanup();
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    );
  };

  it("should display the initial loading message", () => {
    (api.get as any).mockImplementation(() => new Promise(() => {}));

    renderComponent();

    expect(screen.getByText(/carregando/i)).toBeDefined();
  });

  it("should handle API failure by logging and rendering the main container", async () => {
    (api.get as any).mockRejectedValue(new Error("API Error"));

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Pulse FX - Dashboard")).toBeDefined();
    });
  });

  it("should render the layout structure when the indicator list is empty", async () => {
    (api.get as any).mockResolvedValue({ data: [] });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Exibir apenas favoritos")).toBeDefined();
    });
  });

  it("should render the list of indicator cards when the API returns data", async () => {
    const mockIndicators = [
      {
        id: "1",
        name: "US Dollar",
        code: "USD",
        source: "BCB",
        frequency: "daily",
        description: "Exchange rate",
        currentValue: 5.25,
        lastDate: "2026-06-16",
        variation: 0.15,
      },
    ];

    (api.get as any).mockResolvedValue({ data: mockIndicators });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("US Dollar")).toBeDefined();
      expect(screen.getByText(/USD/)).toBeDefined();
    });
  });

  it("should render the main dashboard header title", async () => {
    (api.get as any).mockResolvedValue({ data: [] });

    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /Pulse FX - Dashboard/i }),
      ).toBeDefined();
    });
  });
});
