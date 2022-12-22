import {Box, Input, StackDivider, VStack} from "@chakra-ui/react";
import React, {ChangeEvent, FocusEvent, KeyboardEvent, useCallback, useEffect, useMemo, useState} from "react";

interface AutoCompleteProps {
    /**
     * 候補リスト
     * */
    candidacy?: string[]

    onSelected?: (selected: string, index: number) => void

}

export default function AutoComplete({candidacy = [], onSelected}: AutoCompleteProps) {
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
        return candidacy.map((str, index) => {
            return {
                value: str,
                index: index
            }
        }).filter((str, index) => {
            return str.value.toLowerCase().startsWith(text.toLowerCase())
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
                    onSelected(list[focus].value, list[focus].index)
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
    }, [focus, showBox, onSelected, list])
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
                                            bgColor={i == focus ? "gray.400" : undefined}>{s.value}</Box>) : (
                        <Box padding={2}>見つかりません</Box>)}
            </VStack>
        </Box></Box>
}