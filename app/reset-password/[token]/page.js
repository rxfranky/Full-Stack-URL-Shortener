'use client'

import { useActionState } from "react";
import { useParams } from "next/navigation";


export default function NewPassword() {
    const params = useParams()
    const token = params.token;

    async function handleSubmit(prevState, formData) {
        const dataObj = Object.fromEntries(formData)
        console.log('prevState-', prevState)

        const response = await fetch('http://localhost:4000/reset-password', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            },
            body: JSON.stringify(dataObj)
        })
        const data = await response.json()
        return data;
    }

    const [formState, dispatch, isPending] = useActionState(handleSubmit, 'not submitted yet')
    console.log('formState-', formState, ',isPen-', isPending)

    return (
        <>
            <form action={dispatch}>
                <div className="flex flex-col gap-2 mt-28 justify-center items-center">
                    <input type="text" className='p-2 focus:outline-black rounded-sm w-[350px] bg-gray-200' placeholder='Enter password' name='password' />

                    <input type="text" className='p-2 focus:outline-black rounded-sm w-[350px] bg-gray-200' placeholder='Enter confirm password' name='confirmPassword' />

                    <button className="ml-64 p-2 pl-3 pr-3 rounded-md bg-black cursor-pointer text-white">Reset</button>
                </div>
            </form>
        </>
    )
}