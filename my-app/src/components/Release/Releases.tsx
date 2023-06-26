import React, {ChangeEventHandler, useState} from 'react';
import './Releases.scss'
import ReleaseDivFormat from "./ReleaseDivFormat";
import {Navigate} from "react-router-dom";
import {useAppStore, useReleaseStore} from "../../providers/RootStoreProvider";
import {observer} from "mobx-react-lite";
import SideBar from "../SideBar/SideBar";

const Releases = observer(() => {

    const [filter, setFilter] = useState('all')

    const items = [
        {id: 1, status: 'OPEN'},
        {id: 2, status: 'CLOSED'},
    ]

const filteredItems = items.filter(item => {
    if (filter === 'all') {
      return true;
    } else if (filter === 'OPEN') {
      return item.status === 'OPEN';
    } else if (filter === 'CLOSED') {
      return item.status === 'CLOSED';
    }
    return false; // Filtrer toutes les autres options
  });

    const {authenticated} = useAppStore()

    const {releases} = useReleaseStore()


  const handleChangeFilter = (event : React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(event.target.value); // Mettre à jour le filtre actif
  };

    if (authenticated) {
        return(
            <div className="app_container">
                <div className="app_releases_container">
                    <SideBar
                    formType={'release'}
                    // type={'releases'}
                    currentStage={0}
                />
                {/*<div className={'test'}>*/}
                {/*<select value={filter} onChange={handleChangeFilter}>*/}
                {/*    <option value="all">Toutes les releases</option>*/}
                {/*    <option value="OPEN">Activités ouvertes</option>*/}
                {/*    <option value="CLOSED">Activités fermées</option>*/}
                {/*</select>*/}
                {releases ? (
                    <div className="release_bloc">
                        {releases.map(releases =>
                            <ReleaseDivFormat key={releases.id} release={releases} />
                        )}
                    </div>
                ) : (
                    <p>En attente de la requête...</p>
                )}
                {/*</div>*/}
                </div>
            </div>
        )
    } else {
        return <Navigate to="/login" replace={true}/>
    }
})

export default Releases;
