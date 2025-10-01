import Link from "next/link"
import SubCompo from "./subcompo"


export const BottomSection = ({ forSignup, lineText }) => {
    return (
        <section className="w-[350px] m-auto mt-5">

            <div className="flex items-center gap-1">
                <div className="bg-gray-500 h-[1px] w-full" />
                <span className="text-nowrap">{lineText}</span>
                <div className="bg-gray-500 h-[1px] w-full" />
            </div>

            <SubCompo/>

            {forSignup && (
                <div className="mt-9 text-center">
                    <span>Dont&apos;nt have an account?</span>

                    <Link href={'/signup-page'}><span className="text-cyan-500 font-semibold cursor-pointer">Register Now</span></Link>
                </div>
            )}
        </section>
    )
}
