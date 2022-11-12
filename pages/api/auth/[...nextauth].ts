import NextAuth, {NextAuthOptions, User} from "next-auth"
import Discord, {DiscordProfile} from "next-auth/providers/discord";
import {APIGuild, Routes, RESTPostOAuth2AccessTokenResult} from "discord.js";
import axios from "axios";
import {RawUserData} from "discord.js/typings/rawDataTypes";
import {DiscordAccount, DiscordSession} from "../../../types/next-auth";
import {CallbacksOptions, Profile} from "next-auth/core/types";
import {RESTPostOAuth2AccessTokenWithBotAndGuildsScopeResult} from "discord-api-types/rest/v10/oauth2";
import {MongoDBAdapter} from "@next-auth/mongodb-adapter";
import clientPromise from "../../../lib/mongodb";
import {getToken} from "next-auth/jwt";

export const authOptions: NextAuthOptions = {
    adapter: MongoDBAdapter(clientPromise),
    // Configure one or more authentication providers
    providers: [
        Discord({
            clientId: process.env.DISCORD_CLIENT_ID!!,
            clientSecret: process.env.DISCORD_CLIENT_SECRET!!,
            authorization: {
                params: {scope: "identify email guilds bot", permissions: 8, prompt: "none"}
            },
            profile(prf: User) {
                console.log("PRF!", prf)
                return prf
            }

        }),
// ...add more providers here
    ],

    //session: { strategy: "jwt" },
    callbacks: {
        async jwt({token, account, user, profile}) {


            // Persist the OAuth access_token to the token right after signin
            if (account) {
                console.log(account)
                token.accessToken = account.access_token;
                token.tokenType = account.token_type;

            }

            return token
        },
        async session({session, token, user}) {
            console.log("ses:", user)
            /* const userInfo = await axios.get("https://discord.com/api" + Routes.user(), {
                 headers: {
                     authorization: `${token.tokenType} ${token.accessToken}`,
                 }
             })*/

            /*session.discord = {
                guilds: {} as APIGuild[]
            } as DiscordSession*/
            // Send properties to the client, like an access_token from a provider.

            session.user = user as User;
            return session
        },
    }
}
export default NextAuth(authOptions)