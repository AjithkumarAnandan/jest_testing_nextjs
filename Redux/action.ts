import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "./interceptors";

export const fetchReduxData = createAsyncThunk("reduxtesting", async (url: any, thunkApi) => {
    try {
        const response = await api.get(url)
        return response.data
    } catch (error) {
        return thunkApi.rejectWithValue("Something went wrong")
    }
});