'use client'

import { useActionState } from "react"


export default function ResetPage() {
    async function handleSubmit(prevState, formData) {
        console.log('prevState-', prevState)
        const dataObj = Object.fromEntries(formData)

        const response = await fetch('http://localhost:4000/send-reset-email', {
            method: 'post',
            body: JSON.stringify(dataObj),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json()
        return data;
    }

    const [formState, dispatch, isPending] = useActionState(handleSubmit, 'not sub yet')
    console.log('formState-', formState, ',isPen-', isPending)

    return (
        <>
            <form action={dispatch}>
                <div className="flex gap-3 mt-28 justify-center">
                    <input type="text" className='p-2 focus:outline-black rounded-sm w-[350px] bg-gray-200' placeholder='Enter email' name='email' />

                    <button className="p-2 pl-3 pr-3 rounded-md bg-black cursor-pointer text-white">Send</button>
                </div>
            </form>
        </>
    )
}