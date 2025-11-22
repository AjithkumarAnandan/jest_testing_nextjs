import { render, screen, waitFor } from "@testing-library/react";
import Home from "@/app/page";
import api from "@/Redux/interceptors";


describe("Home component fetches data", () => {
    jest.mock('axios')
    it("fetches data and displays recipe names", async () => {
        (api.get as jest.Mock).mockResolvedValue({
            data: [
                { id: 1, name: "Recipe One" },
                { id: 2, name: "Recipe Two" },
            ],
        });
        render(<Home />)
        await waitFor(() => {
            expect(screen.getByText("Recipe One")).toBeInTheDocument();
            expect(screen.getByText("Recipe Two")).toBeInTheDocument();
        });
        // Optional: verify fetch was called
        expect(api.get).toHaveBeenCalledTimes(1);
        expect(api.get).toHaveBeenCalledWith(
            "/api/"
        );
    })

    it("fetches  data and not displays recipe names", async () => {
        (api.get as jest.Mock).mockResolvedValue({
            data: [],
        });
        render(<Home />)
        await waitFor(() => {
            expect(screen.queryByText(/Recipe/i)).not.toBeInTheDocument();
        });
        // Optional: verify fetch was called
        expect(api.get).toHaveBeenCalledTimes(1);
    });

    it("does not display recipes if fetch fails", async () => {
        (api.get as jest.Mock).mockRejectedValue(new Error("Network error") as any);
        render(<Home />)
        await waitFor(() => {
            expect(screen.queryByText(/Recipe/i)).not.toBeInTheDocument()
        })
        expect(api.get).toHaveBeenCalledTimes(1)
    })

})