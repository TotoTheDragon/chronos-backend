export default {};
export function toBigInt(str: string | undefined): bigint | undefined {
    if (str === undefined) {
        return undefined;
    }
    if(!/^\d+$/.test(str)){
        return undefined;
    }
    return BigInt(str);
}
