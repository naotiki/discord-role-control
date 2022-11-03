import NextAuth, {NextAuthOptions} from "next-auth"
import GithubProvider from "next-auth/providers/github"
import Discord, {DiscordProfile} from "next-auth/providers/discord";
export const authOptions :NextAuthOptions= {
    // Configure one or more authentication providers
    providers: [
        Discord({
            clientId: process.env.DISCORD_CLIENT_ID!!,
            clientSecret: process.env.DISCORD_CLIENT_SECRET!!,
            authorization:""
        }),
        // ...add more providers here
    ],
    callbacks:{
        async jwt({ token, account }) {
            // Persist the OAuth access_token to the token right after signin
            if (account) {
                token.accessToken = account.access_token
            }
            return token
        },
        async session({ session, token, user }) {
            // Send properties to the client, like an access_token from a provider.
            session.user.token = token.accessToken!!
            return session
        }
    }
}
export default NextAuth(authOptions)