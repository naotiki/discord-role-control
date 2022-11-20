import {NextApiRequest, NextApiResponse} from "next";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {unstable_getServerSession} from "next-auth";
import dbConst, {AppDB, UserGuilds} from "@/lib/db";
import axios from "axios";
import {APIPartialGuild, Routes} from "discord-api-types/v10";
import {ObjectId} from "mongodb";
import {discordGuard} from "@/lib/apiUtils";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const appDB = await AppDB.getInstance()
    const [session, accessToken] = await discordGuard(req, res, appDB)
    if (!session || !accessToken) return

    const oid = new ObjectId(session.user.id)

    const userGuilds = (await axios.get<APIPartialGuild[]>("https://discord.com/api/v10" + Routes.userGuilds(), {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })).data
    const registeredGuilds = await appDB.db.collection(dbConst.collections.UserGuilds).findOne<UserGuilds>({
        _id: oid
    })

    res.status(200).json({
        guilds: userGuilds.filter(g => registeredGuilds?.guilds?.includes(g.id))
    })
}