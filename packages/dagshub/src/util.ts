import * as fop from "@fiftyone/plugins";
import {DefaultSettings, Settings} from "./Settings";

export function fetchOrFail(input: RequestInfo | URL, init?: RequestInit) {
    // Fetches, returns the JSON promise for 200, otherwise fails
    return fetch(
        input, init
    ).then(resp => {
        if (!resp.ok) {
            return resp.text().then(text => {return {success: false, val: text}});
            // return {success: false, val: resp.text()};
        } else {
            return resp.json().then(json => {return {success: true, val: json}});
        }
    }).then(({success, val}) => {
        if (success) {
            return val;
        } else {
            throw val;
        }
    })
}

export function usePluginUrl() {
    const settings = fop.usePluginSettings<Settings>("dagshub", DefaultSettings());
    return (path: string) => {
        // Trim the / from the beginning
        if (path.startsWith("/")) {
           path  = path.slice(1);
        }
        return `${settings.server}/${path}`;
    }
}