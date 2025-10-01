'use client'

import { Provider } from "react-redux";
import { makeStore } from "@/store/store";
import { useRef } from "react";

export default function StoreProvider({ children }) {
    const storeRef = useRef(undefined)

    if (!storeRef.current) {
        const store = makeStore()
        storeRef.current = store
    }
    return <Provider store={storeRef.current}>{children}</Provider>
}

