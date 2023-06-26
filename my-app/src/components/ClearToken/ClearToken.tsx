import React, {Dispatch, SetStateAction} from "react";

import './ClearToken.scss'
import {useAppStore} from "../../providers/RootStoreProvider";

interface Render{
    token: string | null,
    setToken: Dispatch<SetStateAction<string | null>>
}

function ClearToken ({token, setToken} : Render) {

    const {logout} = useAppStore()

    const ClearTokenAction = () => {
        logout()
        setToken(null)
    }

    // if (!token) {
    //     return <></>
    // }

    return (
        <button className='button' onClick={ClearTokenAction}>Clear Token</button>
    )
}

