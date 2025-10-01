import NextAuth from "next-auth";
import googleProvider from 'next-auth/providers/google'
import gitHubProvider from 'next-auth/providers/github'

export const authOptions = {
    providers: [
        googleProvider({
            clientId: process.env.GOOGLE_AUTH_CLIENT_ID,
            clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET
        }),
        gitHubProvider({
            clientId: process.env.GITHUB_AUTH_CLIENT_ID,
            clientSecret: process.env.GITHUB_AUTH_CLIENT_SECRET
        })
    ],
    secret: 'supersecret'
}

const handlers = NextAuth({
    providers: [
        googleProvider({
            clientId: process.env.GOOGLE_AUTH_CLIENT_ID,
            clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET
        }),
        gitHubProvider({
            clientId: process.env.GITHUB_AUTH_CLIENT_ID,
            clientSecret: process.env.GITHUB_AUTH_CLIENT_SECRET
        })
    ],
    secret: 'supersecret',
    callbacks: {
        async signIn({ account, user, email, profile }) {
            const response = await fetch('http://localhost:4000/auth/github', {
                method: 'post',
                body: JSON.stringify(user),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const data = await response.json()
            console.log('dataaa-', data)
            if (!data.isAlreadyLoggedIn) {
                return true;
            } else {
                return false;
            }
        }
    }
})


export { handlers as GET, handlers as POST }