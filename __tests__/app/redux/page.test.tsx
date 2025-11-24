

import ReduxComponent from "@/app/redux/page"
import api from "@/Redux/interceptors"
import store from "@/Redux/store"
import { render, screen, waitFor } from "@testing-library/react"
import { Provider } from "react-redux"

jest.mock("@/Redux/interceptors", () => ({
    get: jest.fn(),
}));

describe("Redux data fetch condition", () => {

    it("Redux fetch data success", async () => {
        (api.get as jest.Mock).mockResolvedValue({
            data: {
                recipes: [
                    { id: 1, name: "testing 1" },
                    { id: 2, name: "testing 2" },
                ]
            }
        })

        render(
            <Provider store={store}>
                <ReduxComponent />
            </Provider>
        );

        expect(screen.getByText("Loading...")).toBeInTheDocument()

        await waitFor(() => {
            expect(screen.getByText("testing 1")).toBeInTheDocument()
            expect(screen.getByText("testing 2")).toBeInTheDocument()
        })

        expect(api.get).toHaveBeenCalledTimes(1)
    })

    it("Redux fetch data fails", async () => {
        (api.get as jest.Mock).mockRejectedValueOnce(new Error("something went wrong"));

        render(
            <Provider store={store}>
                <ReduxComponent />
            </Provider>
        );
        const errorMessage = await screen.findByText(/something went wrong/i);
        expect(errorMessage).toBeInTheDocument();
    })
})