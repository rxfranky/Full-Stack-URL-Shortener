'use client'

import Link from "next/link"
import { signOut } from 'next-auth/react'
import Image from "next/image";
import profileImg from '../public/profile.gif'
import { useState } from "react";
import { useEffect } from "react";
import authState from "@/util/auth-status";


export default function Navbar() {
    const [classForDropdown, setClassForDropdown] = useState('top-[-600px]')
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [picture, setPicture] = useState(profileImg)

    const { userData, isLoggedIn, session } = authState()

    useEffect(() => {
        if (session) {
            setEmail(session.user.email)
            setName(session.user.name)
            setPicture(session.user.image)
        }
        if (userData) {
            setEmail(userData.email)
            setName(userData.name)

            if (userData.picture) {
                setPicture(userData.picture)
            }
        }
    }, [session, userData])

    function handleDropdown() {
        setClassForDropdown((state) => {
            if (state == 'top-[-600px]') {
                return 'top-[60px]'
            } else {
                return 'top-[-600px]'
            }
        })
    }

    async function handleSignout() {
        if (session) {
            const response = await fetch('http://localhost:4000/signout', {
                method: 'post',
                body: JSON.stringify({ email: session.user.email }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const data = await response.json()
            console.log('isSignoutSuc-', data)

            if (data.isSignoutSuccess) {
                return signOut()
            }
        }
        
        if (isLoggedIn) {
            const response = await fetch('http://localhost:4000/signout', {
                method: 'post',
                body: JSON.stringify({ email: userData.email }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const data = await response.json()
            console.log('isSignoutSuc-', data)

            if (typeof window !== 'undefined') {
                localStorage.removeItem('email')
                localStorage.removeItem('token')
            }
        }
    }

    return (
        <>
            <nav className="h-[55px] bg-purple-600 flex justify-around items-center font-semibold text-white">
                <Link href={'/'}><span className="text-lg cursor-pointer">BitLinks</span></Link>

                <ul className="flex gap-4">
                    <Link href={(isLoggedIn || session) ? '/short' : '/login-page'}><li className="p-2 pl-3 pr-3 rounded-md bg-black cursor-pointer">Try Now</li></Link>

                    <Link href={'https://github.com/rxfranky'} target="_blank"><li className="p-2 pl-3 pr-3 rounded-md bg-black cursor-pointer">GitHub</li></Link>

                    {(session || isLoggedIn) && (
                        <li className="flex items-center justify-center gap-3">
                            <span>{name}</span>
                            <Image unoptimized className="cursor-pointer rounded-full" onClick={handleDropdown} src={picture} height={35} width={35} priority alt="profile image" />
                        </li>
                    )}
                </ul>

                <div className={`drop-down h-[25vh] w-[15vw] z-1 bg-purple-500 rounded-xl absolute left-[69vw] ${classForDropdown}`} >

                    <div className="bg-purple-400 p-1 mb-2 mt-3">{email}</div>
                    <div onClick={handleSignout} className="bg-purple-400 p-1 hover:border cursor-pointer"><button className="cursor-pointer ">Signout</button></div>
                </div>
            </nav>
        </>
    )
}