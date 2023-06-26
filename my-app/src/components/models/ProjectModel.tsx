export interface ProjectInterface {
    id: number
    name: string
}

export class ProjectModel {

    public id: number;
    public name: string;

    constructor(json: ProjectInterface) {
        this.id = json.id
        this.name = json.name

    }

}