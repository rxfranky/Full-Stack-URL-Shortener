'use client'

import { useActionState } from "react"
import { authActions } from "@/store/authSlice"
import { useDispatch } from "react-redux"
import authState from "@/util/auth-status"

export default function Main({
    forLoginPage,
    forSignup,
    placeholder_1,
    placeholder_2,
    children,
    name_1,
    name_2,
    editVals
}) {
    const { session, userData } = authState()
    const reduxDispatch = useDispatch()

    async function handleSubmit(prevState, formData) {
        const formDataObj = Object.fromEntries(formData)

        if (forSignup) {
            const response = await fetch('http://localhost:4000/signup', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formDataObj)
            })
            const data = await response.json()

            return data;
        }
        if (forLoginPage) {
            const response = await fetch('http://localhost:4000/login', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formDataObj)
            })
            const data = await response.json()

            if (typeof window !== 'undefined') {
                localStorage.setItem('email', data.user.email)
                localStorage.setItem('token', data.token)
            }
            reduxDispatch(authActions.changeAuthState(data))
            return;
        }
        const response = await fetch('http://localhost:4000/short', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ...formDataObj, email: (userData.email || session.user.email), id: (editVals.id ?? '') })
        })
        const data = await response.json()
        return data;
    }

    const [state, dispatch, isPending] = useActionState(handleSubmit, 'not submitted yet')

    return (
        <>
            <main className={`arent p-6 rounded-md flex flex-col gap-3 w-fit items-center m-auto mt-16 ${forLoginPage || forSignup ? '' : 'bg-purple-200'}`}>

                <span className={`font-semibold ${forLoginPage || forSignup ? 'text-3xl font-bold w-[320px] mb-5 mr-5' : ''}`}>

                    {forLoginPage ? 'Welcome back! Glad to see you, Again!' : forSignup ? 'Hello! Register to get started' : 'Generate your Short URL'}
                </span>

                <form className="flex flex-col gap-3" action={dispatch}>

                    <input type="text" className={`p-2 focus:outline-purple-800 rounded-sm w-[350px] ${forLoginPage || forSignup ? 'bg-gray-200' : 'bg-white'}`} placeholder={placeholder_1} name={name_1} defaultValue={editVals?.url ?? ''} />

                    <input type="text" className={`p-2 focus:outline-purple-800 rounded-sm w-[350px] ${forLoginPage || forSignup ? 'bg-gray-200' : 'bg-white'}`} placeholder={placeholder_2} name={name_2} defaultValue={editVals?.preferedText ?? ''} />

                    {(forSignup || forLoginPage) && (
                        <>
                            {children}
                        </>
                    )}

                    <button className="w-[350px] p-1 bg-purple-800 text-white rounded-md cursor-pointer">
                        {forLoginPage ? 'Login' : forSignup ? 'Register' : 'Generate'}
                    </button>
                </form>
            </main>
        </>
    )
}