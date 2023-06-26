import RootStore from "./RootStore";
import {makeObservable, observable, action} from "mobx";

export class ModalStore {
    root: RootStore
    state: number = 0

    constructor(root: RootStore) {
        this.root = root
        makeObservable(this, {
            state: observable,
            closeModal: action,
            openModal: action
        })
    }

    closeModal = () => {
        this.state = 0
    }

    // openModal = (releaseId: number) => {
    //     this.state = releaseId
    // }
    openModal = (id: number) => {
        this.state = id
    }
}

export default ModalStore;
