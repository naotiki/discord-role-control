import {
    Avatar,
    Button,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure
} from "@chakra-ui/react";
import {useSession} from "next-auth/react";
import {APIPartialGuild} from "discord-api-types/v10";
import {ChevronDownIcon} from "@chakra-ui/icons";
import {useRouter} from "next/router";
import {useRecoilState} from "recoil";
import {selectedGuildState} from "@/components/recoil/atoms";

interface Props {
    userGuilds: APIPartialGuild[]
}

export default function GuildSelector(props: Props) {
    const {data: session} = useSession()
    const {isOpen, onOpen, onClose} = useDisclosure()
    const router = useRouter()
    const id = router.query.guildId
    const Guild = () => {
        const g = props.userGuilds.find(g => g.id == id);
        if (!g) return (<>{"サーバー未選択"}</>)
        return (<><Avatar marginX={2} size={"sm"} name={g.name}
                          src={`https://cdn.discordapp.com/icons/${g.id}/${g.icon!!}.png`}/> {g.name}</>)
    }

    const [selectedGuild, setSelectedGuild] = useRecoilState(selectedGuildState)
    return <>
        <Menu>
            <MenuButton as={Button} size='lg' rightIcon={<ChevronDownIcon/>}>

                <Guild/>

            </MenuButton>
            <MenuList>
                {
                    props.userGuilds.map(g => <MenuItem onClick={() => router.push({
                        query: {
                            guildId: g.id
                        }
                    })}><Avatar marginX={2} size="sm" name={g.name}
                                src={`https://cdn.discordapp.com/icons/${g.id}/${g.icon!!}.png`}/>{g.name}</MenuItem>)
                }
            </MenuList>
        </Menu>
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>Modal Title</ModalHeader>
                <ModalCloseButton/>
                <ModalBody>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={onClose}>
                        Close
                    </Button>
                    <Button variant='ghost'>Secondary Action</Button>
                </ModalFooter>
            </ModalContent>
        </Modal></>
}