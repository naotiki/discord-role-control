import {Button} from "@chakra-ui/react";
import {useSession} from "next-auth/react";
import {FaCaretDown} from "react-icons/fa";

export default function GuildSelector() {
    const {data:session}=useSession()
    return <Button  size='lg' rightIcon={<FaCaretDown/>}>
        鯖
    </Button>
}