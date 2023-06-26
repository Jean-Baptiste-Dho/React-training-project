import React, {useEffect, useState} from 'react';
import './Me.scss';
import {getToken, refreshToken, sendRequest} from "../../helpers/AuthenticationHelper";
import {useAppStore} from "../../providers/RootStoreProvider";
import {Navigate} from "react-router-dom";
interface User {
    utilisateur: string,
    roles: Array<string>
}
const Me = ()=> {


    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(getToken() ?? null)

    const {authenticated} = useAppStore()

    const updateUser = async () => {
        const userData = await sendRequest('GET', '/user/me')
        setUser(userData)
    }

    useEffect( () => {
        if(token){
            updateUser()
        }
    }, [token])

    // let test = refreshToken('vincent', 'vincent')
    // console.log(test)

    if(authenticated){
        return (
            <div className="me_container">
                <h2>Connecté en tant que :</h2>
                <h4>{user?.utilisateur}</h4>
                <div>{user?.roles.map((role, index) =>
                    <div> Rôle(s)
                        <p>{role}</p>
                    </div>
                )}
                </div>
            </div>
        )
    }else {
        return <Navigate to="/login" replace={true}/>
    }
}

export default Me;