import {NextApiRequest, NextApiResponse} from "next";
import {Session, unstable_getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {AppDB} from "@/lib/db";
import {ObjectId} from "mongodb";

export async function discordGuard(req: NextApiRequest, res: NextApiResponse, appDB: AppDB): Promise<[Session, string] | undefined[]> {
    const session = await unstable_getServerSession(req, res, authOptions)

    if (!session?.user) {
        res.status(401).json({message: "You must be logged in."});
        return []
    }

    const oid = new ObjectId(session.user.id)
    const accessToken = await appDB.getAccessToken(oid)
    if (!accessToken) {
        res.status(401).json({message: "トークンが無効"});
        return []
    }
    return [session, accessToken]
}