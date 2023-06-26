import {IssueInterface, IssueModel} from "./IssueModel";
import moment from "moment";

export interface StageInterface {
    id: number
    category: string
    status: string
    issues: Array<IssueInterface>
    createdAt: moment.Moment
    updatedAt: moment.Moment
}

export interface NewStageInterface {
    category: string
    status: string
}

export const CURRENT = 'CURRENT'
export const CLOSED = 'CLOSED'
export const SCHEDULED = 'SCHEDULED'
export class StageModel {

    public id: number;
    public category: string;
    public status: string;
    public issues: Array<IssueInterface>
    public updatedAt: moment.Moment;
    public createdAt: moment.Moment;


    constructor(json: StageInterface) {
        this.id = json.id
        this.category = json.category
        this.status = json.status
        this.issues = []
        if (json.issues) {
            this.issues = json.issues.map(issueData => new IssueModel(issueData));
        }
        this.createdAt = moment(json.createdAt)
        this.updatedAt = moment(json.updatedAt)

        // json.issues.map(issueData => {
        //     this.issues.push(new IssueModel(issueData))
        // })
    }

    isClosed() {
        return this.status === CLOSED
    }

    isCurrent() {
        return this.status === CURRENT
    }

    isScheduled() {
        return this.status === SCHEDULED
    }
}