import React, {useEffect, useState} from 'react';
import './Release.scss'
import {Navigate, useParams} from "react-router-dom";
import {sendRequest} from "../../helpers/AuthenticationHelper";
import {useAppStore} from "../../providers/RootStoreProvider";
import {StageInterface, StageModel} from "../models/StageModel";
import Stage from "../Stages/Stage";
import SideBar from "../SideBar/SideBar";
import {observer} from "mobx-react-lite";

const Release = observer(() => {

    const {id} = useParams();
    const {authenticated} = useAppStore()

    const [stages, setStages] = useState<Array<StageInterface>>([]);
    const [currentStage, setCurrentStage] = useState<number>()


    useEffect(() => {
        if(authenticated) {
            fetchData()
        }
    }, []);

    useEffect(() => {
            setCurrent()
    }, [stages]);

    const setCurrent = () => {
        stages.map(stage => {
            if(stage.status === 'CURRENT'){
                setCurrentStage(stage.id)
                console.log('current : '+stage.id)
            } else {
                console.log('not current : '+stage.id)
            }
        })
    }



    const fetchData = async () => {
        let stagesArray: Array<StageInterface> = []
        const stageRequests: Array<Promise<StageInterface>> = []
        const response = await sendRequest('GET', '/release/'+id)
        response.stages.map((stage: StageInterface) => {
            stageRequests.push(sendRequest('GET', '/stage/' + stage.id))
        });
        const stagesData = await Promise.all(stageRequests)
        stagesData.map(stage => stagesArray.push(new StageModel(stage)))
        setStages(stagesArray);
    }

    if (authenticated) {
        return (
            <div className="stages_container">
                {currentStage ?
                    <SideBar formType={'issue'} currentStage={currentStage}/>
                    :
                    <SideBar formType={'release'} currentStage={0} />
                }
              {stages.map((stage, index) => (
                  <Stage key={index} stage={stage}/>
              ))}
            </div>
        )
    } else {
    return <Navigate to="/login" replace={true}/>
    }

})

export default Release;
