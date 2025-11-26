import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import Home from "@/app/page";
import api from "@/Redux/interceptors";
import userEvent from '@testing-library/user-event';
import { toast } from "react-toastify";



jest.mock("@/Redux/interceptors", () => ({
    get: jest.fn(),
    put: jest.fn(),
    post: jest.fn(),
    delete: jest.fn()
}));

jest.mock("react-toastify", () => ({
   toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
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

describe("Home component Delete and update", ()=>{
      // Jest Array
       beforeEach(() => {
        jest.clearAllMocks();
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
            return Promise.resolve({  status: 200, data: { data: currentList } });
        });
        (api.put as jest.Mock).mockImplementation((_url, body) => {
            const { id, name } = body;
            currentList = currentList.map(r =>
                r.id === id ? { ...r, name } : r
            );
            return Promise.resolve({ status: 201,  data: { id, name } });
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
        // Press Enter inside the input
        await userEvent.keyboard('{Enter}');
        await userEvent.click(editBtn);
        // Wait for toast success
        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith('Updated successfully');
        });
        // Wait for updated name
        expect(await screen.findByText(updatedName)).toBeInTheDocument();
    });

    it.each(mockRecipes)("Delete selective data works correctly",async(recipe) => {
        let currentList = [...mockRecipes];
        // ---- FIRST GET (initial load)
        (api.get as jest.Mock).mockImplementation(() => {
            return Promise.resolve({ data: { data: currentList } });
        });

        (api.delete as jest.Mock).mockImplementation((_url, body) => {
            const { id } = body;
            currentList = currentList.filter(r => r.id !== id);
            return Promise.resolve({ status: 201, data: { id } });
        });
        render(<Home/>)
        // Wait for initial list
        for (const r of mockRecipes) {
            const textEle = await screen.findByLabelText(`recipe-${r.id}`);
            expect(textEle).toHaveTextContent(r.name);
        }

        // Click Edit on Recipe One
        const deleteBtn = screen.getByRole("button", {
            name: new RegExp(`delete-${recipe.id}`, "i")
        });

        await userEvent.click(deleteBtn);
    })
})

describe("Home component throw error Delete and update", ()=>{
      // Jest Array
       beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockRecipes = [{ id: 1, name: 'Recipe One' }, { id: 2, name: 'Recipe One' }, { id: 3, name: 'Recipe three' }]

    beforeEach(() => {
        jest.clearAllMocks();
        cleanup();
    });

    it.each(mockRecipes)(`error function edit and delete`, async (recipe) => {
        let currentList = [...mockRecipes];
        // ---- FIRST GET (initial load)
        (api.get as jest.Mock).mockImplementation(() => {
            return Promise.resolve({ data: { data: currentList } });
        });

        (api.put as jest.Mock).mockImplementation((_url, body) => {
            const { id, name } = body;
           return Promise.reject({ status: 500, error: "" });
        });

         (api.delete as jest.Mock).mockImplementation((_url, body) => {
         const { id } = body;
        return Promise.reject({ status: 500, error: 'Something went wrong' });
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
        // Press Enter inside the input
        await userEvent.keyboard('{Enter}');
        await userEvent.click(editBtn);
        // Wait for toast error
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Something went wrong');
        });

        const deleteBtn = screen.getByRole("button", {
            name: new RegExp(`delete-${recipe.id}`, "i")
        });

        await userEvent.click(deleteBtn);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("Something went wrong")
        })
    });
})