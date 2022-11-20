import {DependencyList, useEffect} from "react";

export function useAsyncEffect(effect: () => Promise<void>, deps?: DependencyList) {
    useEffect(() => {
        effect()
    }, deps)
}