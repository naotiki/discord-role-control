import {atom, selector} from "recoil";
import {APIPartialGuild} from "discord-api-types/v10";
import axios from "axios";

export const userGuildState = atom({
    key: "userGuilds",
    default: selector({
        key: "userGuildSelector",
        get: async ({get}) => {

            const u = await (await fetch("/api/discord/guilds")).json()
            return u.guilds as APIPartialGuild[]
        },
    })
});
export const selectedGuildState = atom<APIPartialGuild | null>({
    key: "selectedGuild",
    default: null
})
selector({
    key: "selectedGuildSelector",
    get: async ({get}) => {

    },
})