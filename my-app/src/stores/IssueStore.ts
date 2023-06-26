import RootStore from "./RootStore";
import {makeObservable, observable, action} from "mobx";
import {sendRequest} from "../helpers/AuthenticationHelper";
import {NewReleaseInterface, ReleaseInterface, ReleaseModel} from "../components/models/ReleaseModel";
import {IssueInterface, IssueModel, NewIssueInterface} from "../components/models/IssueModel";


export class IssueStore {
    root: RootStore
    issues : Array<IssueModel>

    constructor(root: RootStore) {
        this.root = root
        this.issues = []
        this.fetchIssues()
        makeObservable(this,{
            issues: observable,
            addIssue: action,
            updateIssue: action,
            // removeIssue: action,
            // modifRelease: action,
            // closeRelease: action
        })
    }

    fetchIssues = async () => {
        const response = await sendRequest('GET', '/issue')
        let issueModels: Array<IssueModel> = [];
        response?.map((issue: IssueInterface) => {
            issueModels.push(new IssueModel(issue));
        })
        this.issues = issueModels
    }

    addIssue = async (issue: NewIssueInterface) => {
        const issues = [...this.issues]
        const response = await sendRequest('POST', '/issue/', issue);
        if(response !== false){
            const newIssue = new IssueModel(response)
            issues.push(newIssue);
            this.issues = issues
            this.root.modalStore.closeModal()
        }
    }

    updateIssue = async (id: number, rawIssue: NewIssueInterface) => {
        const response = await sendRequest('PATCH', '/issue/'+id, rawIssue);
        if(response !== false) {
            const issues = [...this.issues]
            const index = issues.findIndex(issue => issue.id === id)
            issues.splice(index, 1, new IssueModel(response))
            this.issues = issues
            this.root.modalStore.closeModal()
        }
    }

    // modifIssue = async (issue: NewIssueInterface, id:number, closed = false) => {
    //     const issues = [...this.issues]
    //     const response = await sendRequest('PATCH', '/issue/'+id, issue);
    //     if(response !== false){
    //         this.updateIssue(id, response)
    //         this.root.modalStore.closeModal()
    //     }
    // }

    // removeIssue = async (id: number) => {
    //     const issues = [...this.issues]
    //     const response = await sendRequest('DELETE', '/issue/'+id);
    //     console.log(typeof response);
    //     if (response !== false){
    //         const index = issues.findIndex( issue => issue.id === id)
    //         issues.splice(index, 1)
    //         this.issues = issues
    //     }
    // }

    // closeIssue = async (id:number) => {
    //     const data = {'status' : 'CLOSED'}
    //     this.updateIssue(id, data)
    // }


}

export default IssueStore;
