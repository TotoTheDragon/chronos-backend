export default {
    type: 'object',
    required: ['id', 'user', 'original_start_time', 'start_time'],
    properties: {
        id: { type: 'string', format: 'snowflake' },
        user: { type: 'string', format: 'snowflake' },
        shift: { type: 'string', format: 'snowflake' },
        description: { type: 'string' },
        original_start_time: {
            type: 'string',
            format: 'date-time',
        },
        original_end_time: {
            type: 'string',
            format: 'date-time',
        },
        start_time: {
            type: 'string',
            format: 'date-time',
        },
        end_time: {
            type: 'string',
            format: 'date-time',
        },
    },
};
