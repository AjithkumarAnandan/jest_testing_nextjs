import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import Home from "@/app/page";
import api from "@/Redux/interceptors";
import userEvent from '@testing-library/user-event';


jest.mock("@/Redux/interceptors", () => ({
    get: jest.fn(),
    put: jest.fn(),
    post: jest.fn(),
    delete: jest.fn()
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


    const mockRecipes = [{ id: 1, name: 'Recipe One' }, { id: 2, name: 'Recipe One' }, { id: 3, name: 'Recipe three' }]

    beforeEach(() => {
        jest.clearAllMocks();
        cleanup();
    });

    it.each(mockRecipes)(`Edit function works correctly`, async (recipe) => {
        let currentList = [...mockRecipes];
        // ---- FIRST GET (initial load)
        (api.get as jest.Mock).mockImplementation(() => {
            return Promise.resolve({ data: { data: currentList } });
        });
        (api.put as jest.Mock).mockImplementation((_url, body) => {
            const { id, name } = body;

            currentList = currentList.map(r =>
                r.id === id ? { ...r, name } : r
            );

            return Promise.resolve({ data: { id, name } });
        });
        render(<Home />);


        // Wait for initial list
        for (const r of mockRecipes) {
            const textEl = await screen.findByLabelText(`recipe-${r.id}`);
            expect(textEl).toHaveTextContent(r.name);
        }

        // Click Edit on Recipe One
        const editBtn = screen.getByRole("button", {
            name: new RegExp(`edit-${recipe.id}`, "i")
        });

        await userEvent.click(editBtn);
        //Button should now say "Save"
        expect(editBtn).toHaveTextContent("Save");

        // Type new value into the input
        const input = screen.getByLabelText(`edit-input-${recipe.id}`);
        const updatedName = `Recipe updated ${recipe.id}`;
        await userEvent.clear(input);
        await userEvent.type(input, updatedName);

        // ---- SECOND GET (refetch updated list)
        // const updatedList = mockRecipes.map(r =>
        //     r.id === recipe.id ? { ...r, name: updatedName } : r
        // );

        // (api.get as jest.Mock).mockResolvedValueOnce({
        //     data: { data: updatedList }
        // });
        // render(<Home />);
        // Click Save
        await userEvent.click(editBtn);

        // Wait for updated name
        expect(await screen.findByText(updatedName)).toBeInTheDocument();

        // ---- Button returns to Edit
        //   const editBtnAfter = screen.getByRole("button", {
        //     name: new RegExp(`edit-${recipe.id}`, "i")
        //   });
        //   expect(editBtnAfter).toHaveTextContent("Edit");

    });


});
