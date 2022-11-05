import NextAuth, {NextAuthOptions} from "next-auth"
import Discord from "next-auth/providers/discord";
import {Routes} from "discord.js";
import axios from "axios";
import {RawUserData} from "discord.js/typings/rawDataTypes";

export const authOptions: NextAuthOptions = {
    // Configure one or more authentication providers
    providers: [
        Discord({
            clientId: process.env.DISCORD_CLIENT_ID!!,
            clientSecret: process.env.DISCORD_CLIENT_SECRET!!,
            authorization: {
                params: {scope: "identify email guilds bot", permissions: 8, prompt: "none"}
            },
        }),
// ...add more providers here
    ],
    callbacks: {
        async jwt({token, account}) {
            // Persist the OAuth access_token to the token right after signin
            if (account) {
                console.log(account)
                token.accessToken = account.access_token
                token.tokenType = account.token_type
            }
            return token
        }
        ,
        async session({session, token}) {

            const userInfo = await axios.get("https://discord.com/api" + Routes.user(), {
                headers: {
                    authorization: `${token.tokenType} ${token.accessToken}`,
                }
            })

            session.user.discordData = userInfo.data as RawUserData
            // Send properties to the client, like an access_token from a provider.
            session.user.token = token.accessToken!!
            return session
        }
    }
}
export default NextAuth(authOptions)