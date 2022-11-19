import {NextApiRequest, NextApiResponse} from "next";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {unstable_getServerSession} from "next-auth";
import dbConst, {AppDB, UserGuilds} from "@/lib/db";
import axios from "axios";
import {APIPartialGuild, Routes} from "discord-api-types/v10";
import {ObjectId} from "mongodb";
import {APIGuild} from "discord.js";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await unstable_getServerSession(req, res, authOptions)

    if (!session?.user) {
        res.status(401).json({message: "You must be logged in."});
        return
    }

    const appDB = await AppDB.getInstance()
    const oid = new ObjectId(session.user.id)
    const accessToken = await appDB.getAccessToken(oid)
    if (!accessToken) {
        res.status(401).json({message: "トークンが無効"});
        return
    }
    console.log("\n", accessToken, "\n")

    const registeredGuilds = await appDB.db.collection(dbConst.collections.UserGuilds).findOne<UserGuilds>({
        _id: oid
    })
    const guildId = registeredGuilds?.guilds?.find(g => g == req.query.guildId)
    if (!guildId) {
        res.status(400).json({message: "有効なguildIdよこせ"});
        return
    }


    const fullGuild = (await axios.get<APIGuild>("https://discord.com/api/v10" + Routes.guild(guildId), {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })).data


    res.status(200).json({
        guilds: fullGuild
    })
}