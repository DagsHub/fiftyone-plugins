export interface Settings {
    server: string
    in_colab: boolean
}

export const DefaultSettings = (): Settings => {
    return {
        // server: "http://localhost:5152"
        server: "",
        in_colab: false,
    };
}
