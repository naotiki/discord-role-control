import {Account, DefaultSession, DefaultUser} from "next-auth"
import {RawGuildData, RawUserData} from "discord.js/typings/rawDataTypes";
import {APIPartialGuild, APIUser} from "discord-api-types/v10";
import {DiscordProfile} from "next-auth/providers/discord";
import {RESTPostOAuth2AccessTokenWithBotAndGuildsScopeResult} from "discord-api-types/rest/v10/oauth2";
import {Profile} from "next-auth/core/types";

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface User extends DiscordProfile, Profile {
    }

    interface AdapterUser extends User {
    }


    interface Session {
        user: User,
        discord: DiscordSession
    }
}
export type DiscordSession = {
    guilds: APIPartialGuild[]
}
export type DiscordAccount = Account & RESTPostOAuth2AccessTokenWithBotAndGuildsScopeResult
declare module "next-auth/jwt" {
    /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
    interface JWT {
        /** OpenID ID Token */
        accessToken?: string,
        tokenType?: string,
    }
}