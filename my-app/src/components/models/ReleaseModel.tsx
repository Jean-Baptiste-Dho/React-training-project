import moment from "moment";
import {NewStageInterface, StageInterface, StageModel} from "./StageModel";
import {ProjectInterface} from "./ProjectModel";
import {NewUrlInterface, UrlInterface} from "./UrlModel";

export interface ReleaseInterface {
    id: number,
    project: ProjectInterface
    urls : Array<UrlInterface>
    stages : Array<StageInterface>
    comment : string
    status : string
    createdAt: moment.Moment
    updatedAt: moment.Moment
}

export interface FormReleaseInterface {
    project: number,
    urls: Array<NewUrlInterface>
    stages: Array<NewStageInterface>
    comment: string
    status: string
}

export interface NewReleaseInterface {
    project?: number,
    urls?: Array<NewUrlInterface>
    stages?: Array<NewStageInterface>
    comment?: string
    status?: string
}

export const CLOSED = 'CLOSED'
export const OPEN = 'OPEN'
export class ReleaseModel {

    public id: number;
    public project: ProjectInterface;
    public urls: Array<UrlInterface>;
    public stages: Array<StageInterface>
    public comment: string;
    public status: string;
    public createdAt: moment.Moment;
    public updatedAt: moment.Moment;

    constructor(json: ReleaseInterface) {
        this.id = json.id
        this.project = json.project
        this.urls = json.urls
        this.status = json.status
        this.comment = json.comment
        this.createdAt = moment(json.createdAt)
        this.updatedAt = moment(json.updatedAt)
        this.stages = []
        if(json.stages){
            this.stages = json.stages.map(stageData => new StageModel(stageData))
        }
    }

    isClosed() {
        return this.status === CLOSED
    }

    isOpen() {
        return this.status === OPEN
    }
}