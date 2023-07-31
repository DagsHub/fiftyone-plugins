export interface Settings {
    server: string
    in_colab: boolean
    datasource_name: string
}

export const DefaultSettings = (): Settings => {
    return {
        // server: "http://localhost:5152"
        server: "",
        in_colab: false,
        datasource_name: "",
    };
}
