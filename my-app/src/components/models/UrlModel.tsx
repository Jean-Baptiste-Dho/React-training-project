export interface UrlInterface {
    id?: number | null | undefined
    link: string
    alias: string
}

export interface NewUrlInterface {
    link: string
    alias: string
}

export class UrlModel {

    public id: number | null | undefined;
    public link: string;
    public alias: string;


    constructor(json: UrlInterface) {
        this.id = json.id
        this.link = json.link
        this.alias = json.alias

    }

}