import React from 'react';
import './SideBar.scss'
import {Navigate} from "react-router-dom";
import {useAppStore} from "../../providers/RootStoreProvider";
import {observer} from "mobx-react-lite";
import ModalSideBar from "../modal/ModalSideBar";



interface Type {
    formType : string
    // type : string
    currentStage : number
}

const SideBar = observer(({formType, currentStage} : Type) => {

    const {authenticated} = useAppStore()


    if (authenticated) {
        return(
            <div className="sidebar_container">
                <ModalSideBar
                    form={formType}
                    currentStage={currentStage}
                />
                {/*<ul>*/}
                {/*    <li>test1</li>*/}
                {/*    <li>test1</li>*/}
                {/*    <li>test1</li>*/}
                {/*    <li>test1</li>*/}
                {/*    <li>test1</li>*/}
                {/*    <li>test1</li>*/}
                {/*    <li>test1</li>*/}
                {/*    <li>test1</li>*/}
                {/*</ul>*/}
            </div>
        )
    } else {
        return <Navigate to="/login" replace={true}/>
    }
})

export default SideBar;
