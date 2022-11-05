import { useSession } from "next-auth/react"
import {Avatar, HStack, Text, Tooltip} from "@chakra-ui/react";
export default function DiscordUserInfo() {
    const { data: session } = useSession()
    if (session) {
        return (
            <>
                <Tooltip label={`${session.user.name}#${session.user.discordData.discriminator}`}>
                    <HStack>
                        <Avatar name={session.user.name ?? "名前なんかねえよ"} src={session.user.image!!}></Avatar>
                        <Text fontSize="xl">{session.user.name}</Text>
                    </HStack>
                </Tooltip>
            </>
        )
    }
    return (
        <>
            Not signed inだよ～ん
        </>
    )
}