export const SNOWFLAKE_EPOCH = 1669852800000;

/*
    11111111111111111111111111111111111111111111111 11111 111111111111
    64                                              17    12          0

    | Field               | Bits     | Number of bits | Retrieval                            |
    | ------------------- | -------- | -------------- |  ----------------------------------- |
    | Timestamp           | 63 to 17 | 47 bits        |  `(snowflake >> 17) + 1669852800000` |
    | Internal machine ID | 16 to 12 | 5 bits         |  `(snowflake & 0x1F000) >> 12`       |
    | Sequence            | 11 to 0  | 12 bits        |  `snowflake & 0xFFF`                 |
*/

const TIMESTAMP_BITS = 47;
const INTERNALID_BITS = 5;
const SEQUENCE_BITS = 12;

const TIMESTAMP_END = 64 - TIMESTAMP_BITS;
const INTERNALID_END = TIMESTAMP_END - INTERNALID_BITS;
const INTERNALID_BITMASK = BigInt((2 ** INTERNALID_BITS - 1) << SEQUENCE_BITS);
const SEQUENCE_BITMASK = BigInt(2 ** SEQUENCE_BITS - 1);

export class Snowflake {
    sequence: number;
    internalID: number;

    constructor(internalID = 0) {
        this.sequence = 0;
        this.internalID = internalID;
    }

    generate(): bigint {
        const id = convertSnowflakeDataToSnowflake({
            timestamp: Date.now(),
            internalID: this.internalID,
            sequence: this.sequence,
        });

        this.sequence += 1;

        return id;
    }

    deconstruct(snowflake: string): SnowflakeData {
        return convertSnowflakeToSnowflakeData(snowflake);
    }

    getDate(snowflake: string): Date {
        return new Date(this.deconstruct(snowflake).timestamp);
    }
}

interface SnowflakeData {
    timestamp: number;
    internalID: number;
    sequence: number;
}

function convertSnowflakeDataToSnowflake(data: SnowflakeData): bigint {
    let bigint = BigInt(0);

    bigint |= BigInt(data.timestamp - SNOWFLAKE_EPOCH) << BigInt(TIMESTAMP_END);
    bigint |= BigInt(data.internalID << INTERNALID_END);
    bigint |= BigInt(data.sequence);

    return bigint;
}

function convertSnowflakeToSnowflakeData(snowflake: string): SnowflakeData {
    const bigint = BigInt(snowflake);

    const timestamp = Number(bigint >> 17n) + SNOWFLAKE_EPOCH;
    const internalID = Number(bigint & INTERNALID_BITMASK) >> INTERNALID_END;
    const sequence = Number(bigint & SEQUENCE_BITMASK);

    return {
        timestamp,
        internalID,
        sequence,
    };
}

export function validateSnowflake(snowflake: string): boolean {
    const bigint = BigInt(snowflake);

    /*
        Make sure that the snowflake contains a real timestamp
    */
    if (bigint >> 17n === 0n) {
        return false;
    }

    return true;
}
