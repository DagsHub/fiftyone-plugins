export interface Settings {
    server: string
}

export const DefaultSettings = (): Settings => {
    return {
        server: "http://localhost:5152"
    };
}
