import { render, screen, waitFor } from "@testing-library/react";
import Home from "@/app/page";
import api from "@/Redux/interceptors";



jest.mock("@/Redux/interceptors", () => ({
    get: jest.fn(),
}));

describe("Home component fetches data", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("fetches data and displays recipe names", async () => {
        (api.get as jest.Mock).mockResolvedValue({
            data: {
                data: [
                    { id: 1, name: "Recipe One" },
                    { id: 2, name: "Recipe Two" },
                ],
            },
        });

        render(<Home />);

        await waitFor(() => {
            expect(screen.getByText("Recipe One")).toBeInTheDocument();
            expect(screen.getByText("Recipe Two")).toBeInTheDocument();
        });

        expect(api.get).toHaveBeenCalledWith("/api/");
    });

    it("fetches data and shows nothing when empty", async () => {
        (api.get as jest.Mock).mockResolvedValue({
            data: { data: [] },
        });

        render(<Home />);

        await waitFor(() => {
            expect(screen.queryByText(/Recipe/i)).not.toBeInTheDocument();
        });

        expect(api.get).toHaveBeenCalledTimes(1);
    });

    it("does not display recipes if fetch fails", async () => {
        (api.get as jest.Mock).mockRejectedValue(new Error("Network error"));

        render(<Home />);

        await waitFor(() => {
            expect(screen.queryByText(/Recipe/i)).not.toBeInTheDocument();
        });

        expect(api.get).toHaveBeenCalledTimes(1);
    });

});
