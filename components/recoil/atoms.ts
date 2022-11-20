import {atom, selector} from "recoil";
import {APIPartialGuild} from "discord-api-types/v10";
import axios from "axios";
import {APIGuild} from "discord.js";
import {FullGuild} from "@/pages/api/discord/fullGuild";

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
export const selectedGuildState = atom<FullGuild | null>({
    key: "selectedGuild",
    default: null
})
