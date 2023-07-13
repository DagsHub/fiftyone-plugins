import {atom} from "recoil";
import {MetadataFieldSchema} from "./types";

export const metadataFields = atom<MetadataFieldSchema[]>({
    key: "__dagshub__fields",
    default: [],
});