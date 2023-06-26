import React from 'react';
import './Releases.scss'
import {CLOSED, ReleaseModel} from "../models/ReleaseModel";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useReleaseStore} from "../../providers/RootStoreProvider";
import ModalRelease from "../modal/ModalRelease";
import {observer} from "mobx-react-lite";

interface Props {
    release : ReleaseModel
}

const ReleaseDivFormat = observer(({release} : Props) => {

    const {removeRelease, closeRelease} = useReleaseStore()

    const deleteRelease = (id : number ) => {
        removeRelease(id)
    }

        return (
            <div className="release_bloc_item" title={release.comment}>
                <div className={`release ${!release.isClosed() ? 'release_open' : 'release_closed'}`}>
                    <div className={"title"}>
                        <h2>{release.project.name}</h2>
                        <div className={"lien"}>
                            <ModalRelease currentRelease={release.id} className={`release ${!release.isClosed() ? 'link_icon' : 'link_disable'}`}/>
                            <FontAwesomeIcon icon={["fas", "lock"]} onClick={() => closeRelease(release.id)} className={`release ${!release.isClosed() ? 'link_icon' : 'link_disable'}`} title='Cloturer la release'/>
                            <FontAwesomeIcon icon={["fas", "trash"]} onClick={() => deleteRelease(release.id)} className={`release ${!release.isClosed() ? 'link_icon' : 'link_disable'}`} title='Supprimer la release'/>
                        </div>
                    </div>
                    <Link to={"/release/" + release.id} >
                        <div className={"release_content"}>
                            <div className="project">
                                { release.status === CLOSED ?
                                  <span className="date_closed"> Cloturé le {release.updatedAt.format('DD/MM/YYYY')}</span>
                                : <span className="date_open"> Créé le {release.createdAt.format('DD/MM/YYYY')}</span>
                                }
                            </div>
                            { !release.isClosed() &&
                            <div className="stage">
                                <h3>Étape :</h3>
                                {release && release.stages.map((stage, index) => {
                                    return stage.status === 'CURRENT' && <div className="stage_div" key={index}>{stage.category}</div>
                                })}
                            </div>
                            }
                        </div>
                    </Link>
                </div>
            </div>
        )

    })

export default ReleaseDivFormat;