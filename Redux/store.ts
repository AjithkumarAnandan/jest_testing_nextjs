import { configureStore } from "@reduxjs/toolkit"
import { reducerReduxData } from "./reducer"

const store=configureStore({
    reducer:reducerReduxData.reducer
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store