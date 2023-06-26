import React from 'react';
import './Issue.scss'
import {IssueModel} from "../models/IssueModel";

interface Props {
    issue : IssueModel
}

const IssueFormat = ({issue} : Props) => {

        return (
        <tr>
            <td className='status'>{issue.status}</td>
            <td className='last_maj'>{issue.updatedAt.format('D/MM/YYYY')}</td>
            <td className='creator'>{issue.creator.name}</td>
            <td className='section'>{issue.relatedSection}</td>
            <td className='comment'>{issue.comment}</td>
            <td className='link'>
                <div className='support_div'>
                    {issue.attachmentLinks ?
                        issue.attachmentLinks.map((link, index) => <div key={index}>{link}</div>)
                    :
                        <div>Pas de lien ajouté</div>
                    }
                </div>
            </td>
            <td className='support'>
                     <div className={'support_div'}>
                            {issue.supports.map((support, index) => <div key={index}>{support}</div>)}
                    </div>
            </td>
        </tr>
        )
}

export default IssueFormat;