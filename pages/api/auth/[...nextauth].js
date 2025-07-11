import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { db } from "../../../lib/mongodb"
import { verifyPassword } from "../../../lib/auth";

export default NextAuth({
    session: {
        jwt: true,
    },
    provider: [Providers.Credentials({
        credentials: {
            async authorize(credentials) {
                const user = await db.collection('users').findOne({ email: credentials.email })
                if(!user){
                    throw new Error('No user')
                }
                const isValidPassword = await verifyPassword(credentials.password, user.password)
                if(!isValidPassword){
                    throw new Error('error')
                }
                return {
                    email: user.email
                }
            }
        }
    })]
})