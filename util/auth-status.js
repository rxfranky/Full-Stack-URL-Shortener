'use client'

import dispatchAuthAction from "./authdispatch";
import { useSession } from "next-auth/react";
import { useSelector } from "react-redux";


export default function authState() {
    dispatchAuthAction()
    const { userData, isLoggedIn } = useSelector(state => state.auth)
    const { data: session } = useSession();

    return { userData, isLoggedIn, session }
}