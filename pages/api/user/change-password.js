import { hashPassword, verifyPassword } from "../../../lib/auth";
import { db } from "../../../lib/mongodb"
import { getSession } from 'next-auth/client';
async function handler(req, res) {
    if (req.method !== 'PATCH') {
        return;
    }
    const session = await getSession({ req });
    if (!session) {
        res.status(401).json({ message: 'Not authenticated' })
        return;
    }

    const userEmail = session.user.userEmail;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const user = await db.collection('users').findOne({ email: userEmail })
    if (!user) {
        throw new Error('No user')
    }
    const currentPassword = user.password
    const passwordAreEqual = await verifyPassword(oldPassword, currentPassword)
    if (!passwordAreEqual) {
        res.status(403).json({ message: 'Invalid password' })
        return
    }
    const newPasswordHash = await hashPassword(newPassword)
    await db.collection('users').updateOne({ email: userEmail }, {
        $set: {
            password: newPasswordHash
        }
    })
    res.status(200).json({message: 'Successfully updated'})
    return;
}

export default handler; 