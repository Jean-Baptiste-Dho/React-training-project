import {StageInterface} from "./StageModel";
import moment from "moment";

export interface CreatorInterface{
    name: string
    createdAt: moment.Moment
    updatedAt: moment.Moment

}

export interface NewCreatorInterface{
    name?: string
}

export interface IssueInterface {
    id: number,
    status: string
    attachmentLinks?: Array<string>
    relatedSection? : string
    supports : Array<string>
    comment? : string
    creator: CreatorInterface
    stage: StageInterface
    createdAt: moment.Moment
    updatedAt: moment.Moment

}

export interface FormIssueInterface {
    stage: number
    attachmentLinks?: Array<string>
    relatedSection? : string
    supports? : Array<string>
    comment? : string
    creator : string
    status : string
}

export interface NewIssueInterface {
    stage?: number
    attachmentLinks?: Array<string>
    relatedSection?: string
    supports?: Array<string>
    comment?: string
    creator?: CreatorInterface
    status?: string
}

export const NOUVEAU = 'NOUVEAU'
export const ENCOURS = 'EN COURS'
export const PREPROD = 'PREPROD'
export const EFFECTUE = 'EFFECTUE'
export const MISAJOUR = 'MIS A JOUR'
export const VALIDE = 'VALIDE'
export const ENATTENTE = 'EN ATTENTE'
export const IMPOSSIBLE = 'IMPOSSIBLE'
export class IssueModel {

    public id: number;
    public attachmentLinks;
    public relatedSection;
    public comment;
    public supports ;
    public status;
    public stage;
    public creator;
    public createdAt: moment.Moment;
    public updatedAt: moment.Moment;

    constructor(json: IssueInterface) {
        this.id = json.id
        this.attachmentLinks = json.attachmentLinks
        this.status = json.status
        this.stage = json.stage
        this.supports = json.supports
        this.comment = json.comment
        this.relatedSection = json.relatedSection
        this.creator = json.creator
        this.createdAt = moment(json.createdAt)
        this.updatedAt = moment(json.updatedAt)

    }

    isNouveau() {
        return this.status === NOUVEAU
    }

    isEnCour() {
        return this.status === ENCOURS
    }

    isPreprod() {
        return this.status === PREPROD
    }

    isEffectue() {
        return this.status === EFFECTUE
    }

    isMisAJour() {
        return this.status === MISAJOUR
    }

    isValide() {
        return this.status === VALIDE
    }

    isEnAttente() {
        return this.status === ENATTENTE
    }

    isImpossible() {
        return this.status === IMPOSSIBLE
    }

}