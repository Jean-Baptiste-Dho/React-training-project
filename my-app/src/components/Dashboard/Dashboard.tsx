import React, { useEffect, useState} from 'react';
import './Dashboard.scss'
import {getToken, sendRequest} from "../../helpers/AuthenticationHelper";
import {IssueInterface, IssueModel} from "../models/IssueModel";
import {useAppStore} from "../../providers/RootStoreProvider";
import {Navigate} from "react-router-dom";
import {observer} from "mobx-react-lite";
import IssueFormat from "../Issue/IssueFormat";

const Dashboard = observer(() => {

    const [issue, setIssue] = useState<Array<IssueModel>>();

    const {authenticated} = useAppStore()


    console.log(issue)

    useEffect(() => {
        if (authenticated) {
            sendRequest('GET', '/issue')
                .then((response => {
                    let issueModels: Array<IssueModel> = []
                    response.map((issue: IssueInterface) => {
                        issueModels.push(new IssueModel(issue))
                    })
                    setIssue(issueModels)
                }));
        }
    }, [authenticated])

if(authenticated){
    return(
        <div>
            <h1>Recap</h1>

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

})

export default Dashboard;