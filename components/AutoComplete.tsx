import {Box, Input, StackDivider, VStack} from "@chakra-ui/react";
import React, {ChangeEvent, FocusEvent, KeyboardEvent, useCallback, useEffect, useMemo, useState} from "react";
import {retry} from "@aws-sdk/credential-provider-imds/dist-types/remoteProvider/retry";

type AutoCompleteElement<T> = {
    text: string
    value?: T
}

interface AutoCompleteProps<T> {
    /**
     * 候補リスト
     * */
    candidacy?: AutoCompleteElement<T>[]

    onSelected?: (selected: AutoCompleteElement<T>, index: number, array: AutoCompleteElement<T>[] | undefined) => void
}

export default function AutoComplete<T>({candidacy = [], onSelected}: AutoCompleteProps<T>) {
    const [text, setText] = useState('')
    const [focus, setFocus] = useState<number | null>(null)
    const [showBox, setShowBox] = useState(false)

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (!showBox) {
            setShowBox(true)
        }
        setText(event.target.value)
    }

    const list = useMemo(() => {
        return candidacy.map((e, index) => {

            return {
                ...e,
                index: index
            }
        }).filter((ele) => {
            return ele.text.toLowerCase().startsWith(text.toLowerCase())
        })
    }, [text])
    useEffect(() => {
        if (focus != null) {
            setFocus(focus < list.length - 1 ? focus : list.length - 1)
            return;
        }
    }, [list])
    const handleFocus = useCallback((enable: boolean) => {
        setShowBox(enable)
    }, [])
    const handleKey = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
        switch (event.key) {
            case "ArrowUp": {
                event.preventDefault()
                if (focus == null) {
                    setFocus(0)
                    return
                }
                setFocus(focus > 0 ? focus - 1 : 0)
                break
            }
            case "ArrowDown": {
                event.preventDefault()
                if (focus == null) {
                    setFocus(0)
                    return;
                }
                setFocus(focus < list.length - 1 ? focus + 1 : list.length - 1)
                break
            }
            case "Enter": {
                event.preventDefault()
                if (onSelected && focus != null && focus < list.length) {
                    onSelected(list[focus], list[focus].index, candidacy)
                    setShowBox(false)
                }
                break
            }
            case "Escape": {
                event.preventDefault()
                if (focus != null) {
                    setFocus(null)
                } else if (showBox) {
                    setShowBox(false)
                }
                break
            }
        }
    }, [focus, showBox, onSelected, list, candidacy])
    return <Box pos={"relative"} onFocus={() => {
        handleFocus(true)
    }} onBlur={() => {
        handleFocus(false)
    }}>
        <Input
            value={text}
            onChange={handleChange}
            onKeyDown={handleKey}
            placeholder='Here is a sample placeholder'
            size='sm'
        />
        <Box display={showBox ? undefined : "none"} tabIndex={-1} onKeyDown={handleKey} zIndex={1} border={"1px"}
             borderColor={"white"} rounded={10} bgColor={"grey"}
             w={"100%"} pos={"absolute"} top={10}>
            <VStack spacing={0} divider={<StackDivider></StackDivider>} align={"stretch"}>
                {list.length != 0 ?
                    list.map((s, i) => <Box padding={2}
                                            bgColor={i == focus ? "gray.400" : undefined}>{s.text}</Box>) : (
                        <Box padding={2}>見つかりません</Box>)}
            </VStack>
        </Box></Box>
}