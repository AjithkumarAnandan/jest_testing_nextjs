'use client'
import { fetchReduxData } from "@/Redux/action";
import { AppDispatch } from "@/Redux/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

function ReduxComponent() {
    const dispatch = useDispatch<AppDispatch>();
    const {reduxData:{recipes:data}, loading:isLoading, error} = useSelector((state: any) => state);

    useEffect(() => {
        dispatch(fetchReduxData('/recipes/search?q=p'));
    }, [dispatch]);

    if (error) {
        return <p>something went wrong</p>
    }

    return (
        <div>
            {isLoading ? "Loading..." :
                (Array.isArray(data) && data.map((item: any,) => {
                    return <div key={item.id}>
                        {item.name}
                    </div>
                }))}
        </div>
    )
}

export default ReduxComponent;
