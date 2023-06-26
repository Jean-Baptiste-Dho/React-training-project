import RootStore from "./RootStore";
import {makeObservable, observable, computed, action} from "mobx";
import {isAuthenticated, sendRequest, TOKEN_KEY} from "../helpers/AuthenticationHelper";

export class AppStore {
    root: RootStore
    authenticated: boolean = false
    user: string
    role: Array<string>

    constructor(root: RootStore) {
        this.root = root
        this.user = ''
        this.role = []
        // this.getMe()
        makeObservable(this, {
            authenticated: observable,
            login: action,
            logout: action,
            getRole: action,
            getUser: action
        })

        this.authenticated = isAuthenticated();
        this.getMe()
    }

    async initialize() {
        await this.getMe();
    }

    getMe = async ()=> {
        if(this.authenticated) {
            const response = await sendRequest('GET', '/user/me')
            console.log(response)
            if (response !== false && response.utilisateur) {
                this.user = response.utilisateur
                this.role = response.Role
            } else {
                console.log('Non connecté - merci de vous identifier pour utiliser l\'application')
            }
        }
    }

    getUser = () => {
        return this.user
    }

    getRole = () => {
        return this.role
    }

    logout = () => {
        if (localStorage.getItem(TOKEN_KEY)){
            localStorage.removeItem(TOKEN_KEY)
        }
        this.authenticated = false
        // window.location.href = '/login'
    }

    login = (value: string) => {
        localStorage.setItem(TOKEN_KEY, value)
        this.authenticated = true
        this.getMe()
            // window.location.href = '/'
    }
}

export default AppStore;
