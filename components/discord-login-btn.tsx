import { useSession, signIn, signOut } from "next-auth/react"
import {FaDiscord} from "react-icons/fa";
import {Button} from "@chakra-ui/react";
export default function DiscordLoginBtn() {
    const { data: session } = useSession()
    if (session) {
        return (
            <>
                {console.log(session)}
                Signed in as {session.user.email} <br />
                <Button onClick={() => signOut()}>Sign out</Button>
            </>
        )
    }
    return (
        <>
            Not signed in <br />
            <Button onClick={() => signIn("discord")} leftIcon={<FaDiscord/>}>
                Discordでログイン
            </Button>
        </>
    )
}