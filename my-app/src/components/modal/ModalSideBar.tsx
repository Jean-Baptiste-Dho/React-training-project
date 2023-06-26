import React, {useState} from 'react';
import './ModalSideBar.scss'
import {useAppStore, useModalStore} from "../../providers/RootStoreProvider";
import {Navigate} from "react-router-dom";
import FormRelease from "../Release/FormRelease";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import FormIssue from "../Issue/FormIssue";
import {observer} from "mobx-react-lite";
import {createPortal} from "react-dom";

interface Props {
    form:string
    currentStage : number
}


const ModalSideBar = observer(({form, currentStage} : Props) => {

    const [modal, setModal] = useState(false);

    const {authenticated} = useAppStore()

    const toggleModal = () => {
        setModal(!modal)
    }

    if(authenticated){
        return(
            <div className="modalSideBar_container">
                { form === 'release' ?
                    <FontAwesomeIcon icon={["fas", "plus"]} onClick={() => toggleModal()}  className ='btn-add' title='Ajouter une release'/>
                    :
                    <FontAwesomeIcon icon={["fas", "plus"]} onClick={() => toggleModal()}  className ='btn-add' title='Ajouter une issue'/>
                }
                {modal && createPortal(
                    <div className="modal">
                        <div className="overlay" onClick={() => toggleModal()}>
                        </div>
                        <div className="modal-content">
                            {form === 'release' ?
                                <FormRelease currentRelease={0} methode={'POST'}/>
                                :
                                <FormIssue currentStage={currentStage} methode={'POST'}/>
                            }
                            <button onClick={() => toggleModal()} className="close-modal">Close Modal</button>
                        </div>
                    </div>
                , document.body)}
            </div>
        )
    } else {
        return <Navigate to="/login" replace={true}/>
    }

})

export default ModalSideBar ;