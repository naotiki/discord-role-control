import { useSession } from "next-auth/react"
import {Avatar, HStack, Text, Tooltip} from "@chakra-ui/react";
export default function DiscordUserInfo() {
    const { data: session } = useSession()
    if (session) {
        return (
            <>
                <Tooltip label={`${session.user.username}#${session.user.discriminator}`}>
                    <HStack>
                        <Avatar name={session.user.username ?? "名前なんかねえよ"} src={session.user.image_url!!}></Avatar>
                        <Text fontSize="xl">{session.user.username}</Text>
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