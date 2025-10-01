import Main from "@/root-components/main"
import Navbar from "@/root-components/navbar"
import Link from "next/link"
import { BottomSection } from "./_components/bottom-section"


export default function LoginPage() {
    return (
        <>
            <Navbar/>
            <Main
                forLoginPage placeholder_1={'Enter your email'}
                placeholder_2='Enter your password'
                name_1='email'
                name_2='password'
            >
                <Link className="ml-auto mr-3" href={'/reset-password'}>Forget Password?</Link>
            </Main>
            <BottomSection lineText={'Or Login with'} forSignup />
        </>
    )
}