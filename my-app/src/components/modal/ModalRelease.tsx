import React, {useState} from 'react';
import './ModalRelease.scss'
import {useAppStore, useModalStore} from "../../providers/RootStoreProvider";
import {Navigate} from "react-router-dom";
import FormRelease from "../Release/FormRelease";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {createPortal} from "react-dom";
import {observer} from "mobx-react-lite";

interface Props {
    currentRelease : number
    className : string
}


const ModalRelease = observer(({currentRelease, className} : Props) => {

    const {authenticated} = useAppStore()
    const {state, closeModal, openModal} = useModalStore()

    if(authenticated){
        return(
            <>
                <FontAwesomeIcon icon={["fas", "pen"]} onClick={() => openModal(currentRelease)} className={'btn-modif'+className} title='modifier la release'/>
                {state === currentRelease && createPortal(
                    <div className="modal">
                        <div className="overlay" onClick={closeModal}>
                        </div>
                        <div className="modal-content">
                                <FormRelease currentRelease={currentRelease} methode={'PATCH'}/>
                            <button onClick={closeModal} className="close-modal">Close Modal</button>
                        </div>
                    </div>
                , document.body)}
            </>
        )
    } else {
        return <Navigate to="/login" replace={true}/>
    }

})

export default ModalRelease;