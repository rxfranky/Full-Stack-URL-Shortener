'use client'

import { fetchStore } from "@/store/authAction";

import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

export default function dispatchAuthAction() {
    const email = useSelector(state => state.auth.userData.email)
    const dispatch = useDispatch()

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const email = localStorage.getItem('email')
            dispatch(fetchStore(email))
        }
    }, [dispatch, email])

}