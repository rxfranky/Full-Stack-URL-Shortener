'use client'

import Image from "next/image"
import github from '@/public/github.png'
import { signIn } from "next-auth/react"
import { GoogleLogin } from '@react-oauth/google'
import { useDispatch } from "react-redux"
import { authActions } from "@/store/authSlice"


export default function SubCompo() {
    const dispatch = useDispatch()

    return (
        <>
            <div className="flex justify-center mt-3 gap-4">

                <span onClick={() => { signIn('github') }} className="p-[6px] pl-6 pr-6 border rounded-sm cursor-pointer">

                    <Image src={github} width={25} height={25} alt="github icon"></Image>
                </span>

                <GoogleLogin
                    onSuccess={async (response) => {
                        let idToken = response.credential;

                        const res = await fetch('http://localhost:4000/auth/google', {
                            body: JSON.stringify({ idToken }),
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            method: 'post'
                        })
                        const data = await res.json()
                        console.log('dataa-', data)

                        dispatch(authActions.changeAuthState(data))

                        localStorage.setItem('email', data.user.email)
                        localStorage.setItem('token', data.token)

                    }}

                    onError={() => {
                        console.log('err in google login')
                    }}
                />

            </div>
        </>
    )
}