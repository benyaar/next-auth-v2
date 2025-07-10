import { hashPassword } from "../../../lib/auth"
import { db } from "../../../lib/mongodb"

async function handler(req, res) {
    if (req.method === 'POST') {
        const { email, password } = req.body
        if (!email || !email.includes('@') || !password || password.trim().length < 7) {
            res.status(422).json('Invalid input')
            return
        }
        const hashedPassword = await hashPassword(password)

        const result = await db.collection('users').insertOne({
            email, password: hashedPassword
        })
        res.status(201).json('Created user')
        return
    }

}
export default handler