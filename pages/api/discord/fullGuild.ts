import {NextApiRequest, NextApiResponse} from "next";
import dbConst, {AppDB, UserGuilds} from "@/lib/db";
import axios from "axios";
import {APIGuildCategoryChannel, APIGuildChannel, ChannelType, Routes} from "discord-api-types/v10";
import {ObjectId} from "mongodb";
import {APIGuild} from "discord.js";
import {discordGuard} from "@/lib/apiUtils";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const appDB = await AppDB.getInstance()
    const [session, accessToken] = await discordGuard(req, res, appDB)
    if (!session || !accessToken) return
    console.log("\n", accessToken, "\n")
    const oid = new ObjectId(session.user!!.id)
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
            Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`
        }
    }))
    const channels = (await axios.get<APIGuildChannel<ChannelType>[]>("https://discord.com/api/v10" + Routes.guildChannels(guildId), {
        headers: {
            Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`
        }
    })).data


    const rootChannel = {
        position: -1,
        children: channels.filter(c => !c.parent_id && ![ChannelType.GuildCategory, ChannelType.PublicThread, ChannelType.PrivateThread, ChannelType.AnnouncementThread].includes(c.type)).sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    } as Categories


    const list: Categories[] = channels.filter(c => c.type == ChannelType.GuildCategory).map(c => {
        return {
            ...c,
            children: channels.filter(kid => kid.parent_id == c.id && kid.type != ChannelType.GuildCategory).sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
        } as Categories
    }).concat(rootChannel).sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    /*const list: RootChannels[] = []
    channels.filter(c => ![
        ChannelType.PublicThread,
        ChannelType.PrivateThread,
        ChannelType.AnnouncementThread
    ].includes(c.type)).forEach(c => {
        if (c.type == ChannelType.GuildCategory) {
            list.push({
                ...c,
                children: channels.filter(kid => kid.parent_id == c.id && kid.type != ChannelType.GuildCategory)
            } as RootChannels)
        } else if (!c.parent_id) {
            list.push(c as RootChannels)
        }

    })
    //list= list.sort((a, b) => (a.position ?? 0) - (b.position ?? 0))*/

    res.status(200).json({
        ...fullGuild.data,
        categories: list
    } as FullGuild)
}
type Channel = Exclude<ChannelType, ChannelType.GuildCategory | ChannelType.PublicThread | ChannelType.PrivateThread | ChannelType.AnnouncementThread>
export type Categories =
    {
        children: APIGuildChannel<Channel>[]
    } & APIGuildCategoryChannel
export type FullGuild = {
    categories: Categories[]
} & APIGuild