export enum MetadataFieldType {
    BOOLEAN = "BOOLEAN",
    INTEGER = "INTEGER",
    FLOAT = "FLOAT",
    STRING = "STRING",
    BLOB = "BLOB",
}

export interface MetadataFieldSchema {
    name: string,
    valueType: MetadataFieldType,
    multiple: boolean,
}

const MAX_STRING_LENGTH = 500;

export function validateFieldValue(field: MetadataFieldType, value: string | boolean) {
    if (field == MetadataFieldType.INTEGER || field == MetadataFieldType.FLOAT) {
        const num = Number(value);
        if (Number.isNaN(num)) {
            throw new Error(`Not a valid number`);
        }
        if (field == MetadataFieldType.INTEGER && !Number.isInteger(num)) {
            throw new Error(`Not a valid integer`);
        }
        return num;
    }
    if (field == MetadataFieldType.BOOLEAN) {
        // Don't do any casting here, just assume that we're getting a boolean for now
        if (typeof value !== "boolean") {
            throw new Error(`Not a valid boolean`);
        }
        return value;
    }
    if (field == MetadataFieldType.STRING) {
        if (typeof value !== "string") {
            throw new Error(`Not a string`);
        }
        if (value.length > MAX_STRING_LENGTH) {
            throw new Error(`Bigger than the maximum length of ${MAX_STRING_LENGTH}`);
        }
    }
    return value;
}