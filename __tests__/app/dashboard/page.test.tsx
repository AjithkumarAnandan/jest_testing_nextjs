import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DashboardPage from "@/app/dashboard/page";
import axios from "axios";

jest.mock("axios") // Mock axios

describe("DashboardPage Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('shows "Invalid credentials" when username and password are "username" and "password"', async () => {
    render(<DashboardPage />)

    fireEvent.change(screen.getByRole("textbox", { name: /username/i }), {
      target: { value: "username1" },
    })
    fireEvent.change(screen.getByRole("textbox", { name: /password/i }), {
      target: { value: "password1" },
    })

    fireEvent.click(screen.getByRole("button", { name: /submit/i }))

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
      expect(screen.queryByText(/testing/i)).not.toBeInTheDocument()
    })

    expect(axios.get).not.toHaveBeenCalled()
  })

  it("fetches and displays recipes for other credentials", async () => {
    // Mock successful axios response
    (axios.get as jest.Mock).mockResolvedValue({
      data: {
        recipes: [
          { id: 1, name: "testing 1" },
          { id: 2, name: "testing 2" },
        ],
      },
    })

    render(<DashboardPage />)

    fireEvent.change(screen.getByRole("textbox", { name: /username/i }), {
      target: { value: "username" },
    })
    fireEvent.change(screen.getByRole("textbox", { name: /password/i }), {
      target: { value: "password" },
    })

    fireEvent.click(screen.getByRole("button", { name: /submit/i }))

    await waitFor(() => {
      expect(screen.getByText("testing 1")).toBeInTheDocument()
      expect(screen.getByText("testing 2")).toBeInTheDocument()
    })

    expect(axios.get).toHaveBeenCalledTimes(1)
  })

  it("displays error when axios call fails", async () => {
    // Mock axios failure
    (axios.get as jest.Mock).mockRejectedValue(new Error("Network error"))

    render(<DashboardPage />)

    fireEvent.change(screen.getByRole("textbox", { name: /username/i }), {
      target: { value: "username" },
    })
    fireEvent.change(screen.getByRole("textbox", { name: /password/i }), {
      target: { value: "password" },
    })

    fireEvent.click(screen.getByRole("button", { name: /submit/i }))

    await waitFor(() => {
      expect(screen.getByText(/failed to fetch recipes/i)).toBeInTheDocument()
      expect(screen.queryByText(/testing/i)).not.toBeInTheDocument()
    })

    expect(axios.get).toHaveBeenCalledTimes(1)
  })
})
