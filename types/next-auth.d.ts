import { DefaultSession } from "next-auth"
import {RawUserData} from "discord.js/typings/rawDataTypes";
declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            discordData:RawUserData,
            token: string
        } & DefaultSession["user"]
    }
}

declare module "next-auth/jwt" {
    /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
    interface JWT {
        /** OpenID ID Token */
        accessToken?: string,
        tokenType?:string
    }
}