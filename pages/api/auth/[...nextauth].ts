import NextAuth, {NextAuthOptions, User} from "next-auth"
import Discord, {DiscordProfile} from "next-auth/providers/discord";
import {DiscordAccount} from "@/types/next-auth";
import {MongoDBAdapter} from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import dbConst, {UserGuilds, UserSummery} from "@/lib/db";
import {ObjectId} from "mongodb";
import pick from "@/utils/pick";
import {JWT} from "next-auth/jwt";
import axios from "axios";
import {TokenEndpointHandler} from "next-auth/providers";
import {TokenSetParameters} from "openid-client";

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
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

            if (Date.parse(session.expires) < Date.now()) {
            }

            session.user = token.user as User
            return session
        },
        async jwt({token, account, user, profile}): Promise<JWT> {


            // Persist the OAuth access_token to the token right after signin
            if (account && user) {
                console.debug("Create Token")
                return {
                    user: user,
                    accessToken: account.access_token,
                    tokenType: account.token_type,
                    refreshToken: account.refresh_token,
                    expiresAt: account.expires_at,
                }

            }

            // Return previous token if the access token has not expired yet
            if (Date.now() < (token?.expiresAt ?? 0) * 1000) {
                console.debug(`Token available (expires at: ${token.expiresAt})`);
                return token;
            }

            return await refreshAccessToken(token)
        }
    }
}

export default NextAuth(authOptions)

async function refreshAccessToken(token: JWT): Promise<JWT> {
    console.debug("Refresh Token")
    const result = await axios.post("https://discord.com/api/v10/oauth2/token", {
        'client_id': process.env.DISCORD_CLIENT_ID!!,
        'client_secret': process.env.DISCORD_CLIENT_SECRET!!,
        'grant_type': 'refresh_token',
        'refresh_token': token.refreshToken
    }, {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    })
    const tokenResult = result.data as TokenSetParameters
    return {
        ...token,
        accessToken: tokenResult.access_token,
        expiresAt: tokenResult.expires_at,
        tokenType: tokenResult.token_type,
        refreshToken: tokenResult.refresh_token
    }
}