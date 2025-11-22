import { render, screen, waitFor } from "@testing-library/react";
import Home from "@/app/page";


describe("Home component fetches data", () => {
    it("renders Test text", () => {
        render(<Home />);
        expect(screen.getByText("test")).toBeInTheDocument()
    })
    it("does not render", () => {
        render(<Home />);
        expect(screen.queryByText('Test')).not.toBeInTheDocument()
    })
    beforeEach(() => {
        global.fetch = jest.fn()
    });
    afterEach(() => {
        jest.resetAllMocks();
    });

    it("fetches data and displays recipe names", async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => ({
                recipes: [
                    { id: 1, name: "Recipe One" },
                    { id: 2, name: "Recipe Two" },
                ],
            }),
        });
        render(<Home />)

        await waitFor(() => {
            expect(screen.getByText("Recipe One")).toBeInTheDocument();
            expect(screen.getByText("Recipe Two")).toBeInTheDocument();
        });

        // Optional: verify fetch was called
        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(global.fetch).toHaveBeenCalledWith(
            "https://dummyjson.com/recipes/search?q"
        );

    })

    it("fetches  data and not displays recipe names", async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => ({
                recipes: [

                ],
            }),
        });
        render(<Home />)

        await waitFor(() => {
            expect(screen.queryByText(/Recipe/i)).not.toBeInTheDocument();
        });

        // Optional: verify fetch was called
        expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it("does not display recipes if fetch fails", async () => {
       
(global.fetch as jest.Mock).mockRejectedValue(new Error("Network error") as any);

        render(<Home />)

        await waitFor(() => {
            expect(screen.queryByText(/Recipe/i)).not.toBeInTheDocument()
        })
        expect(global.fetch).toHaveBeenCalledTimes(1)
    })

})