export default {};
export function toBigInt(str: string | undefined): bigint | undefined {
    return str === undefined ? undefined : BigInt(str);
}
