'use client'

import Navbar from "../root-components/navbar"
import Image from "next/image"
import vector from '@/public/vector.jpg'
import Link from "next/link"
import authState from "@/util/auth-status"


export default function Home() {

  const { session, isLoggedIn } = authState()

  return (
    <>
      <Navbar />

      <main className="parent h-[42vh] bg-purple-100 grid grid-cols-2" >
        <section className="sec-1 m-auto">
          <div className="sub-parent flex flex-col items-center gap-3">
            <div className="text-center">
              <h1 className="text-lg font-bold">The best URL Shortner in the Market</h1>
              <p className="w-[30vw]">We are most straightforward URL Shortner in the world. Most of the
                url shortner tracks you or asks you to give your details for login. We
                understand your needs and here we have created this URL shortner</p>
            </div>

            <div className="text-white">
              <Link href={(isLoggedIn || session) ? '/short' : '/login-page'}><button className="p-2 pl-3 pr-3 rounded-md bg-purple-700 cursor-pointer">Try Now</button></Link>

              <Link href={'https://github.com/rxfranky'} target="_blank"><button className="p-2 pl-3 pr-3 ml-4 rounded-md bg-purple-700 cursor-pointer">GitHub</button></Link>
            </div>
          </div>
        </section>

        <section className="sec-2 image relative">
          <Image src={vector} alt="some people discussing" fill priority className="mix-blend-darken"></Image>
        </section>
      </main>
    </>
  )
}