import {defaultCollections} from "@next-auth/mongodb-adapter";
import {User} from "next-auth";
import {APIPartialGuild} from "discord-api-types/v10";
import clientPromise from "@/lib/mongodb";
import {Db, ObjectId} from "mongodb";
import {DiscordAccount} from "@/types/next-auth";

const config = {
    collections: {
        ...defaultCollections,
        UserGuilds: "userGuilds"
    },
    databaseName: "auth"
}
export default config;

export type UserGuilds = UserSummery & {

    guilds: string[]
}
export type GuildSummery = Pick<APIPartialGuild, "name" | "description" | "icon" | "id" | "splash">
export type UserSummery = Pick<User, "discordId" | "discriminator" | "username">

const authDB = async () => (await clientPromise).db(config.databaseName)

export class AppDB {
    private static _instance: AppDB | undefined = undefined
    db: Db

    constructor(db: Db) {
        this.db = db
    }

    static async getInstance() {
        if (this._instance) return this._instance
        this._instance = new AppDB(await authDB())
        return this._instance
    }

    async getAccessToken(id: ObjectId) {
        console.log(id)
        const a = (await this.db.collection(config.collections.Accounts).findOne<DiscordAccount>({
            userId: id
        }))?.access_token
        console.log(a)
        return a!!
    }
}