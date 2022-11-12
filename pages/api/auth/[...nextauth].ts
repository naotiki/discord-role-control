import NextAuth, {NextAuthOptions, User} from "next-auth"
import Discord, {DiscordProfile} from "next-auth/providers/discord";
import {APIGuild, Routes, RESTPostOAuth2AccessTokenResult} from "discord.js";
import axios from "axios";
import {DiscordAccount, DiscordSession} from "../../../types/next-auth";
import {MongoDBAdapter} from "@next-auth/mongodb-adapter";
import clientPromise from "../../../lib/mongodb";

export const authOptions: NextAuthOptions = {
    adapter: MongoDBAdapter(clientPromise),
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
                console.log("PRF!", profile)
                return {discordId: profile.id, ...profile}
            }


        }),
    ],

    callbacks: {
        async signIn({account, user}) {
            const discordAccount = account as DiscordAccount | null
            if (!discordAccount) return false
            return true
        },
        async session({session, token, user}) {
            console.log("ses:", user)
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