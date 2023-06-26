import React, {useState, useEffect} from 'react';
import './FormIssue.scss'
import {client, getToken, sendRequest} from "../../helpers/AuthenticationHelper";
import {Field, FieldArray, Form, Formik} from "formik";
import {Navigate} from "react-router-dom";
import {useAppStore, useIssueStore} from "../../providers/RootStoreProvider";
import {StageInterface} from "../models/StageModel";
import {FormIssueInterface, IssueInterface} from "../models/IssueModel";
import {observer} from "mobx-react-lite";


interface UserInterface {
    utilisateur : string
    Role: Array<String>
}

interface Creator{
    name: string
}
interface Props {
    currentStage : number
    methode: string
    // toggleModal: Function
}

const FormIssue  = observer(({currentStage, methode} : Props) => {

    const {authenticated, getUser} = useAppStore()

    const [errorMessage, setErrorMessage] = useState<string|null>('');
    const [succesMessage, setSuccesMessage] = useState<string|null>('');
    const [stages, setStages] = useState<Array<StageInterface>>([])
    const [definedValues, setDefinedValues] = useState<FormIssueInterface>({stage:currentStage, comment:'', relatedSection:'', supports:[], attachmentLinks:[''], status:'CREATE', creator: getUser() })
    const [modifiedIssue, setModifiedIssue] = useState<IssueInterface>()
    // const [test , setTest] = useState(false)

    const {addIssue, updateIssue} = useIssueStore()



    const options = [
        { value: 'PC', label: 'PC' },
        { value: 'TABLETTE', label: 'TABLETTE' },
        { value: 'IOS', label: 'iOS' },
        { value: 'ANDROID', label: 'ANDROID' }
    ];


    useEffect(()=> {
        if(authenticated) {
            sendRequest('GET', '/stage/').then(stages => {
                setStages(stages)
            })
        }
    }, [authenticated])


    useEffect(() => {
        if((methode === 'POST' || methode === 'PATCH') && modifiedIssue){
            setValues(methode, modifiedIssue);
        }
    }, [modifiedIssue, ])

    //
    // useEffect(() => {
    //     toggleModal()
    // }, [test])

    /*
     * Vérification des props pour afficher/masquer/préremplir les bons champs du form
     */
    const setValues = (methode : string, modifiedIssue : IssueInterface) => {
        if(methode === 'PATCH'){
            console.log(modifiedIssue)
            setDefinedValues({stage:currentStage, comment:modifiedIssue.comment, relatedSection:modifiedIssue.relatedSection, supports:modifiedIssue.supports, attachmentLinks:modifiedIssue.attachmentLinks, status:modifiedIssue.status, creator:modifiedIssue.creator.name })

        } else {
            setDefinedValues({stage:currentStage, comment:'', relatedSection:'', supports:[], attachmentLinks:[''], status:'CREATE', creator:getUser() })
            console.log('Default values')
        }
    }



    // console.log(stages)
    console.log(currentStage)

    // const setToggle = () => {
    //        return toggle
    // }

    // async function postIssue(datas: any, token: string | null) {
    //     // console.log('datas :'+datas)
    //     if(token){
    //         try {
    //             const response = await client.request({
    //                 method:'POST',
    //                 url: 'issue/',
    //                 headers: {
    //                   Authorization: "Bearer " + token
    //                 },
    //                 data: datas
    //             })
    //             if (response.status === 201) {
    //                 setSuccesMessage('Ticket crée avec succès.')
    //                 setErrorMessage(null)
    //             } else {
    //                 setErrorMessage('Veuillez remplir tous les champs du formulaire.')
    //                 setSuccesMessage(null)
    //             }
    //
    //         } catch (error) {
    //             console.error("Error:", error);
    //         }
    //     }
    // }

    if (authenticated) {
        return(
            <div className="formIssue_container">
                <h2>Formulaire Issue</h2>
                <h3>Rajoutera une issue sur le stage en cours</h3>
                <Formik
                    // initialValues={definedValues}
                    initialValues={{stage:currentStage, comment:'', relatedSection:'', supports:[], attachmentLinks:[]}}
                    onSubmit={(values, { setSubmitting, resetForm}) => {

                        console.log(values)
                        console.log(values.stage)
                        addIssue(values)

                        setTimeout(() => {
                            setSubmitting(false)
                            // setTest(!test)
                        },2000)
                    }}
                >
                    {({ values, errors, touched, isSubmitting}) => (
                        <Form id="form_issue">
                            <div className="form_item">
                                <label>Support(s) concerné(s) :</label>
                                <div id="for_item_supports">
                                    {options.map((option, index) => (
                                        <div key={option.value}>
                                            <Field type="checkbox" name="supports" id={"supports"+index} value={option.value} />
                                            <label htmlFor={"supports"+index} >{option.label}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="form_item">
                                <label htmlFor="attachmentLinks">Lien Images</label>
                                <FieldArray
                                name="attachmentLinks"
                                render={arrayHelpers => (
                                    <div className="attchmentLink">
                                        <button className="add_lien_button" type="button"  onClick={() => arrayHelpers.push('')}>
                                            Ajouter un lien
                                        </button>
                                        {values.attachmentLinks.map((attachmentLink, index) => (
                                            <div key={index} className="attchmentLink_div">
                                                <Field name={`attachmentLinks[${index}]`} className="attchmentLink_input"/>
                                                <button className="attchmentLink_button" type="button" onClick={() => arrayHelpers.remove(index)}>
                                                    -Suppr-
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                />
                            </div>
                            <div className="form_item">
                                <label htmlFor="relatedSection">Section concernée :</label>
                                <Field className="form_item_input" type="text" name="relatedSection" id={"relatedSection"} />
                            </div>
                            <div className="form_item">
                                <label htmlFor="comment">Problème rencontré :</label>
                                <Field as="textarea" className="form_item_input" type="text" name="comment" id={"comment"} />
                            </div>
                            <button className="form_item_button" type="submit" disabled={isSubmitting}>
                                Submit
                            </button>
                        </Form>
                    )}
                </Formik>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                {succesMessage && <p className="error-message">{succesMessage}</p>}
            </div>
        )
    } else {
        return <Navigate to="/login" replace={true}/>
    }
})

export default FormIssue;