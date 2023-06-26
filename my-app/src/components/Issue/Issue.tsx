import React, { useEffect, useState} from 'react';
import './Issue.scss'
import {getToken, sendRequest} from "../../helpers/AuthenticationHelper";
import {IssueInterface, IssueModel} from "../models/IssueModel";
import IssueFormat from "./IssueFormat";
import {useAppStore} from "../../providers/RootStoreProvider";
import {Navigate} from "react-router-dom";


interface Props {
    issue : IssueModel
}

function Issue (){

    const [issue, setIssue] = useState<Array<IssueModel>>();
    const [token, setToken] = useState(getToken())

    const {authenticated, login} = useAppStore()



        useEffect(() => {
            if (authenticated) {
                sendRequest('GET', '/issue')
                    .then((response => {
                        let releaseModels: Array<IssueModel> = []
                        response.map((issue: IssueInterface) => {
                            releaseModels.push(new IssueModel(issue))
                        })
                        setIssue(releaseModels)
                    }));
            }
    }, [authenticated])

if(authenticated){
    return(
        <div>
            <h1>Issues</h1>
            {issue ? (
                <table>
                    <thead>
                        <tr>
                            <th>Issue Id</th>
                            <th>Stage Id</th>
                            <th>Liens documentation</th>
                            <th>Section concernée</th>
                            <th>Supports</th>
                            <th>Commentaires</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                    {issue.map(issue =>
                        <IssueFormat key={issue.id} issue={issue}></IssueFormat>
                    )}
                    </tbody>
                </table>
            ) : (
                <p>En attente...</p>
            )}
        </div>
    )
} else {
    return <Navigate to="/login" replace={true}/>
}

}

export default Issue;