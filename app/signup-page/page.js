import Navbar from "@/root-components/navbar";
import Main from "@/root-components/main";
import { BottomSection } from "../login-page/_components/bottom-section";


export default async function SignupPage() {

    return (
        <>
            <Navbar />
            <Main
                forSignup placeholder_1='Enter your name'
                placeholder_2={'Enter your email'}
                name_1={'name'}
                name_2={'email'}
            >
                <input type="text" className={`p-2 focus:outline-purple-800 rounded-sm w-[350px] bg-gray-200`} placeholder='Password' name="password" />
                <input type="text" className={`p-2 focus:outline-purple-800 rounded-sm w-[350px] mb-4 bg-gray-200`} placeholder='Confirm password' name="confirmPassword" />
            </Main>
            <BottomSection lineText={'Or Register with'} />
        </>
    )
}