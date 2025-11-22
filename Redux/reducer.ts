import { createSlice } from "@reduxjs/toolkit";
import { fetchReduxData } from "./action";

interface initialStateProps {
    reduxData: any;
    loading: boolean;
    error: string | null | undefined;
}

const initialState: initialStateProps = {
    reduxData: [], loading: false, error: null
}

export const reducerReduxData = createSlice({
    name: "axiostesting",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(
            fetchReduxData.pending, (state, action) => {
                state.loading = true;
            }).addCase(fetchReduxData.fulfilled, (state, action) => {
                state.error = null;
                state.reduxData = action.payload;
                state.loading = false;
            }).addCase(fetchReduxData.rejected, (state, action) => {
                state.error = action.error.message;
                state.reduxData = [];
                state.loading = false;
            })
    },
})