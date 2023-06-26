import RootStore from "./RootStore";
import {makeObservable, observable, action} from "mobx";
import {sendRequest} from "../helpers/AuthenticationHelper";
import {NewReleaseInterface, ReleaseInterface, ReleaseModel} from "../components/models/ReleaseModel";


export class ReleaseStore {
    root: RootStore
    releases : Array<ReleaseModel>

    constructor(root: RootStore) {
        this.root = root
        this.releases = []
        this.fetchReleases()
        makeObservable(this,{
            releases: observable,
            addRelease: action,
            removeRelease: action,
            updateRelease: action,
            // modifRelease: action,
            // closeRelease: action
        })
    }

    fetchReleases = async () => {
        const response = await sendRequest('GET', '/release')
        let releaseModels: Array<ReleaseModel> = [];
        response?.map((release: ReleaseInterface) => {
            releaseModels.push(new ReleaseModel(release));
        })
        this.releases = releaseModels
    }

    addRelease = async (release: NewReleaseInterface) => {
        const releases = [...this.releases]
        const response = await sendRequest('POST', '/release/', release);
        if(response !== false){
            const newRelease = new ReleaseModel(response)
            releases.push(newRelease);
            this.releases = releases
            this.root.modalStore.closeModal()
        }
    }

    // modifRelease = async (release: NewReleaseInterface, id:number, closed = false) => {
    //     const releases = [...this.releases]
    //     const response = await sendRequest('PATCH', '/release/'+id, release);
    //     if(response !== false){
    //         this.updateRelease(id, response)
    //         this.root.modalStore.closeModal()
    //     }
    // }
    removeRelease = async (id: number) => {
        const releases = [...this.releases]
        const response = await sendRequest('DELETE', '/release/'+id);
        console.log(typeof response);
        if (response !== false){
            const index = releases.findIndex( release => release.id === id)
            releases.splice(index, 1)
            this.releases = releases
        }
    }

    closeRelease = async (id:number) => {
        const data = {'status' : 'CLOSED'}
        this.updateRelease(id, data)
    }

    updateRelease = async (id: number, rawRelease: NewReleaseInterface) => {
        const response = await sendRequest('PATCH', '/release/'+id, rawRelease);
        if(response !== false) {
            const releases = [...this.releases]
            const index = releases.findIndex(release => release.id === id)
            releases.splice(index, 1, new ReleaseModel(response))
            this.releases = releases
            this.root.modalStore.closeModal()
        }
    }

}

export default ReleaseStore;
