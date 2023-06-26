import React from 'react';
import './Releases.scss'
import {ReleaseModel} from "../models/ReleaseModel";

interface Props {
    release : ReleaseModel
}

function ReleaseListFormat ({release} : Props){

    // console.log(release)
    // console.log(release.urls[0].alias)
    // console.log(release.stages[0].category)


        return (
            <tr>
                <td>{release.id}</td>
                <td>
                    <div>{release.project.name ? release.project.name : 'null'}</div>
                </td>
                <td>
                    {release.urls.map((url, index)=>
                        <div key={index}><a href={url.link}>{url.alias !== '' ? url.alias : url.link}</a></div>
                    )}
                </td>
                <td>
                    {release.stages.map((stage, index)=>
                        <p key={index}>{stage.category  !== '' ? stage.category : 'null'}</p>
                    )}
                </td>
                <td>{release.comment}</td>
            </tr>
        )
    }

export default ReleaseListFormat;