import React, {useEffect, useState} from 'react';
import './Stage.scss'
import {getToken, sendRequest} from "../../helpers/AuthenticationHelper";
import {Navigate} from "react-router-dom";
import {useAppStore} from "../../providers/RootStoreProvider";
import {CURRENT, StageInterface} from "../models/StageModel";
import {IssueInterface, IssueModel} from "../models/IssueModel";
import IssueFormat from "../Issue/IssueFormat";
import {number} from "yup";

interface Props {
    stage : StageInterface
}
const Stage = ({stage} :Props) => {

    const [issues, setIssues] = useState<Array<IssueModel>>([]);
    const [token] = useState(getToken())
    const [closed, setClosed] = useState(stage.status !== CURRENT)

    const {authenticated} = useAppStore()

    useEffect(() => {
        if (authenticated) {
            fetchData()
        }
    }, []);



    const fetchData = async () => {
        let issuesArray: Array<IssueModel> = []
        const response = await sendRequest('GET', '/stage/'+stage.id)
        response.issues.map((issue: IssueInterface) => {
            issuesArray.push(new IssueModel(issue))
            setIssues(issuesArray);
        });
    }

    // console.log(stage.status)

    const accordion = () => {
        setClosed(!closed)
    }

    const openClass = closed ? 'issues_container_closed' : ''
    let stageStatus = 'scheduled';
    switch(stage.status){
        case 'CLOSED' : stageStatus = 'closed';
        break;
        case 'CURRENT' : stageStatus = 'current';
        break;
        case 'SCHEDULED' : stageStatus = 'scheduled';
        break;
    }


    if (authenticated) {
        return (
            <div className="stages_container_accordion">
                <button className={"accordion stage_"+stageStatus} onClick={() => accordion()}>Stage {stage.category} - ({stageStatus})</button>
                <table className={"issues_container "+openClass}>
                    <thead>
                        <tr>
                            <th className='status'>statut</th>
                            <th className='maj'>Dernière update</th>
                            <th className='creator'>Créateur</th>
                            <th className='section'>Partie Concernée</th>
                            <th className='comment'>Problème rencontré</th>
                            <th className='link'>Liens img</th>
                            <th className='support'>Support</th>
                        </tr>
                    </thead>
                    <tbody>
                        {issues ? issues.map((issue, index) =>
                                <IssueFormat key={index} issue={issue} />
                            ) : <div>Pas d'issues actuellement</div>
                        }
                    </tbody>
                </table>
            </div>
        )
    } else {
        return <Navigate to="/login" replace={true}/>
    }
}

export default Stage;
