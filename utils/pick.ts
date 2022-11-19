export default <T, P extends Pick<T, keyof T>>(o: T, keys: readonly (keyof T)[]) => {
    return Object.fromEntries(keys.map(k => [k, o[k]])) as P
}
