import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DashboardPage from "@/app/dashboard/page";
import axios from "axios";
import api from "@/Redux/interceptors";

// jest.mock("axios") // Mock axios
jest.mock('@/Redux/interceptors', () => ({
  post: jest.fn(),
}));

describe("DashboardPage Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('POST request sends name, email, and age.', async () => {
    (api.post as jest.Mock).mockResolvedValue({
      data: { status: 200 }
    })
    render(<DashboardPage />)

    fireEvent.change(screen.getByRole("textbox", { name: /username/i }), {
      target: { value: "username1" },
    })
    fireEvent.change(screen.getByRole("textbox", { name: /email/i }), {
      target: { value: "ak@gmail.com" },
    })
    fireEvent.change(screen.getByLabelText(/age/i), {
      target: { value: 24 }
    });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }))

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        "/api/",
        expect.objectContaining({
          name: "username1",
          email: "ak@gmail.com",
          age: "24"
        })
      );
    });
    expect(await screen.findByText(/Successfully done/i)).toBeInTheDocument();
  })

  it("Handle Error message", async () => {
    (api.post as jest.Mock).mockRejectedValue(new Error("Network error"));


    render(<DashboardPage />);

    // Fill required fields (or your form won't submit correctly)
    fireEvent.change(screen.getByRole("textbox", { name: /username/i }), {
      target: { value: "username1" },
    });

    fireEvent.change(screen.getByRole("textbox", { name: /email/i }), {
      target: { value: "ak@gmail.com" },
    });

    fireEvent.change(screen.getByRole("spinbutton", { name: /age/i }), {
      target: { value: 24 },
    });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(await screen.findByText(/Failed to fetch recipes/i))
      .toBeInTheDocument();

    // Ensure success message did NOT appear
    expect(screen.queryByText(/Successfully done/i)).not.toBeInTheDocument();

  });

  it("shows validation error when name, age, and email are empty", async () => {
    // Mock API failure for invalid data
    (api.post as jest.Mock).mockRejectedValue(new Error("Invalid data"));

    render(<DashboardPage />);

    // Simulate empty input fields
    fireEvent.change(screen.getByRole("textbox", { name: /username/i }), {
      target: { value: "" },
    });

    fireEvent.change(screen.getByRole("textbox", { name: /email/i }), {
      target: { value: "" },
    });

    fireEvent.change(screen.getByRole("spinbutton", { name: /age/i }), {
      target: { value: "" },
    });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    // Assert validation or API error appears
    expect(
      await screen.findByText(/invalid data/i)
    ).toBeInTheDocument();

    // Assert success message never appears
    expect(
      screen.queryByText(/successfully done/i)
    ).not.toBeInTheDocument();
  });
})