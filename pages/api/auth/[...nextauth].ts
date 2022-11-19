import NextAuth, {NextAuthOptions, User} from "next-auth"
import Discord, {DiscordProfile} from "next-auth/providers/discord";
import {DiscordAccount} from "@/types/next-auth";
import {MongoDBAdapter} from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import dbConst, {UserGuilds, UserSummery} from "@/lib/db";
import {ObjectId} from "mongodb";
import pick from "@/utils/pick";
import {APIGuild} from "discord.js";

export const authOptions: NextAuthOptions = {
    adapter: MongoDBAdapter(clientPromise, dbConst),
    providers: [
        Discord({
            clientId: process.env.DISCORD_CLIENT_ID!!,
            clientSecret: process.env.DISCORD_CLIENT_SECRET!!,
            authorization: {
                params: {scope: "identify email guilds bot", permissions: 8, prompt: "none"}
            },
            profile(profile: DiscordProfile) {
                if (profile.avatar === null) {
                    const defaultAvatarNumber = parseInt(profile.discriminator) % 5
                    profile.image_url = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`
                } else {
                    const format = profile.avatar.startsWith("a_") ? "gif" : "png"
                    profile.image_url = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`
                }
                return {discordId: profile.id, ...profile}
            },
        }),
    ],
    events: {
        async signIn({user, account}) {
            const discordAccount = account as DiscordAccount;
            if (!ObjectId.isValid(user.id)) return
            const client = await clientPromise;
            const collection = client.db(dbConst.databaseName).collection<UserGuilds>(dbConst.collections.UserGuilds)
            const userData = await collection.findOne({
                _id: new ObjectId(user.id)
            })
            const guildId = discordAccount.guild.id
            const userSummery = pick<User, UserSummery>(user, ["username", "discriminator", "discordId"])
            if (!userData) {
                await collection.insertOne({
                    _id: new ObjectId(user.id),
                    guilds: [guildId],
                    ...userSummery
                })
            } else {
                await collection.updateOne({
                    _id: new ObjectId(user.id)
                }, {
                    $addToSet: {
                        guilds: guildId
                    }
                })
            }
        }
    },
    callbacks: {
        async signIn({account, user}) {
            const discordAccount = account as DiscordAccount | null
            if (!discordAccount?.guild) return false
            return true;
        },
        async session({session, token, user}) {
            session.user = user as User;
            return session
        },
        /*async jwt({token, account, user, profile}) {


            // Persist the OAuth access_token to the token right after signin
            if (account) {
                console.log(account)
                token.accessToken = account.access_token;
                token.tokenType = account.token_type;

            }

            return token
        },*/
    }
}
export default NextAuth(authOptions)