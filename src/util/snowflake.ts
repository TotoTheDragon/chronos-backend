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

export type snowflake = string;

export class Snowflake {
    sequence: number;
    internalID: number;

    constructor(internalID = 0) {
        this.sequence = 0;
        this.internalID = internalID;
    }

    generate(): snowflake {
        const id = convertSnowflakeDataToSnowflake({
            timestamp: Date.now(),
            internalID: this.internalID,
            sequence: this.sequence,
        });

        this.sequence += 1;

        return id;
    }

    deconstruct(snowflake: snowflake): SnowflakeData {
        return convertSnowflakeToSnowflakeData(snowflake);
    }

    getDate(snowflake: snowflake): Date {
        return new Date(this.deconstruct(snowflake).timestamp);
    }
}

interface SnowflakeData {
    timestamp: number;
    internalID: number;
    sequence: number;
}

function convertSnowflakeDataToSnowflake(data: SnowflakeData): string {
    const timestamp = (data.timestamp - SNOWFLAKE_EPOCH)
        .toString(2)
        .padStart(TIMESTAMP_BITS, '0');
    const internalID = data.internalID
        .toString(2)
        .padStart(INTERNALID_BITS, '0');
    const sequence = data.sequence.toString(2).padStart(SEQUENCE_BITS, '0');

    const binaryValue = '0b' + timestamp + internalID + sequence;

    const bigint = BigInt(binaryValue);

    return bigint.toString(10);
}

function convertSnowflakeToSnowflakeData(snowflake: string): SnowflakeData {
    const bigint = BigInt(snowflake);
    const binaryValue = bigint.toString(2).padStart(64, '0');
    const timestamp =
        parseInt(binaryValue.substr(0, TIMESTAMP_BITS), 2) + SNOWFLAKE_EPOCH;
    const internalID = parseInt(
        binaryValue.substr(TIMESTAMP_BITS, INTERNALID_BITS),
        2,
    );
    const sequence = parseInt(
        binaryValue.substr(TIMESTAMP_BITS + INTERNALID_BITS, SEQUENCE_BITS),
        2,
    );

    return {
        timestamp,
        internalID,
        sequence,
    };
}
