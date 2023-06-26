import AppStore from "./AppStore";
import ReleaseStore from "./ReleaseStore";
import ModalStore from "./ModalStore";
import IssueStore from "./IssueStore";

class RootStore {
    appStore: AppStore
    releaseStore: ReleaseStore
    modalStore : ModalStore
    issueStore : IssueStore

    constructor() {
        this.appStore = new AppStore(this)
        this.releaseStore = new ReleaseStore(this)
        this.modalStore = new ModalStore(this)
        this.issueStore = new IssueStore(this)
    }
}

export default RootStore;
