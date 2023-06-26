import React, {FunctionComponent, useEffect, useState} from 'react';
import './FormRelease.scss'
import {client, getToken, sendRequest} from "../../helpers/AuthenticationHelper";
import {Field, FieldArray, FieldProps, Form, Formik, getIn} from "formik";
import * as Yup from 'yup';
import {useAppStore, useModalStore, useReleaseStore} from "../../providers/RootStoreProvider";
import {Navigate} from "react-router-dom";
import {FormReleaseInterface, ReleaseInterface, ReleaseModel} from "../models/ReleaseModel";
import {NewStageInterface} from "../models/StageModel";
import {NewUrlInterface} from "../models/UrlModel";
import {observer} from "mobx-react-lite";

interface ProjectInterface {
    id : number
    name: string
}

// interface UserInterface {
//     utilisateur : string
//     Role: Array<String>
// }

interface ErrorMessageProps {
    name: string,
}

interface ModifReleaseInterface {
    currentRelease : number
    methode : string
}

const FormRelease = observer(({currentRelease, methode} : ModifReleaseInterface) => {

    const [token] = useState(getToken())
    // const [user, setUser] = useState<UserInterface>()
    const [errorMessage, setErrorMessage] = useState<string|null>('');
    const [succesMessage, setSuccesMessage] = useState<string|null>('');
    const [projects, setProjects] = useState<Array<ProjectInterface>>([])
    const [definedValues, setDefinedValues] = useState<FormReleaseInterface>({project:0, urls:[], stages:[{category:'', status:'CURRENT'}], comment:'', status : 'OPEN'})
    const [releaseCreator, setReleaseCreator] = useState<string | null>('')
    const [modifiedRelease, setModifiedRelease] = useState<ReleaseInterface>()

    const {authenticated, getUser, getRole} = useAppStore()
    const {addRelease, updateRelease} = useReleaseStore()

    /*
     * Requète de récupération des projets existant pour la liste du formulaire et les vérifications
     */
    useEffect(()=> {
        if (authenticated) {
            sendRequest('GET', '/project/').then(projects => {
                setProjects(projects)
            })
        }
    }, [token, methode])

    /*
     * Récupère le créateur de la release à modifier
     */
    useEffect(()=> {
        if(currentRelease !== 0){
            sendRequest('GET', '/release/'+currentRelease).then(release => {
                setReleaseCreator(release.user.name)
                setModifiedRelease(release)
            })
        }
    }, [currentRelease])

    useEffect(() => {
        if((methode === 'POST' || methode === 'PATCH') && modifiedRelease){
            setValues(methode, modifiedRelease);
        }
    }, [modifiedRelease])


    /*
     * Vérification des champs qui doivent être non-vide
     */
    const isNotEmpty = (value: any) => {
        let error;
        if(value === ""){
           return 'Required';
        }
    }


    /*
     * Gestion de l'input des stages du formulaire avec Yup
     */
    const schema = Yup.object().shape({
        stages: Yup.array()
            .of(
              Yup.object().shape({
                category: Yup.string().required('Required'), // these constraints take precedence
              })
            )
            .required('Must have stage') // these constraints are shown if and only if inner constraints are satisfied
            .min(1, 'Minimum of 1 stage'),
        });


    const ErrorMessage: FunctionComponent<ErrorMessageProps> = ({name}) => {
        return <Field
         name={name}
         render={({ form }: FieldProps) => {
           const error = getIn(form.errors, name);
           const touch = getIn(form.touched, name);
           return touch && error ? error : null;
         }}
       />
    };

    /*
     * Vérification des props pour afficher/masquer/préremplir les bons champs du form
     */
    const setValues = (methode : string, modifiedRelease : ReleaseInterface) => {
        if(methode === 'PATCH'){
            console.log(modifiedRelease)
            setDefinedValues({project:modifiedRelease.project.id, urls:formatUrls(modifiedRelease), stages:formatStages(modifiedRelease), comment:modifiedRelease.comment, status : 'OPEN'})

        } else {
            setDefinedValues({project:0, urls:[], stages:[{category:'', status:'CURRENT'}], comment:'', status : 'OPEN'})
            console.log('Default values')
        }
    }

    /****************************************************/

    /*
     * F(x) test du role de l'utilisateur
     */
    const formatStages = (modifiedRelease: ReleaseInterface) => {
        let stages : Array<NewStageInterface> = []
        modifiedRelease.stages.map(stage =>
            stages.push({
                category: stage.category,
                status: stage.status
            })
        )
        return stages
    }

    const formatUrls = (modifiedRelease: ReleaseInterface) => {
        let urls : Array<NewUrlInterface> = []
        modifiedRelease.urls.map(stage =>
            urls.push({
                link: stage.link,
                alias: stage.alias
            })
        )
        return urls
    }

    /****************************************************/

    if (authenticated) {
        return(
            <div>
                { methode === 'POST' ?
                    <h2> Création d'une release :</h2>
                    :
                    <h2> Modification d'une release :</h2>
                }
                <Formik
                    initialValues={definedValues}
                    enableReinitialize={true}
                    validationSchema={schema}
                    onSubmit={(values, {setSubmitting, resetForm}) => {

                    // console.log('defined Values :'+definedValues)

                    if(methode === 'POST') {
                        if(values.project !== 0) {
                            addRelease(values)
                            setSuccesMessage('Création réussie !')
                            setErrorMessage('')
                        } else {
                            setSuccesMessage('')
                            setErrorMessage('Erreur dans la création. Merci de saisir à nouveau votre demande')
                        }
                    } else if (methode ==='PATCH') {
                        // if(values.project !== 0 && (user?.utilisateur === releaseCreator || user?.Role.find(element => 'ROLE_ADMIN'))) {
                        if(values.project !== 0 && (getUser() === releaseCreator || getRole().find(element => 'ROLE_ADMIN'))) {

                            updateRelease(currentRelease, values)
                            setSuccesMessage('Modification réussie !')
                            setErrorMessage('')
                        } else {
                            setSuccesMessage('')
                            setErrorMessage('Erreur dans la Modification. Merci de saisir à nouveau votre demande')
                        }
                    } else {
                        // console.log("erreur stage")
                        setSuccesMessage('')
                        setErrorMessage('Erreur dans la saisie. Merci de saisir à nouveau votre demande')
                    }

                    setTimeout(() => {
                        setSubmitting(false)
                    },3000)
                }}
                >
                    {({values, errors, touched, isSubmitting}) => (
                        <Form id="form_release">
                            <div className="form_item">
                                <label htmlFor="project">* Projet Concerné :</label>
                                {/*<div className="form_item_div">*/}
                                    <Field
                                        as='select'
                                        multiple={false}
                                        className="form_item_input"
                                        type="text"
                                        name="project"
                                        id={"project"}
                                        validate={isNotEmpty}
                                    >
                                    <option value="">---</option>
                                    {projects.map((project, index) => (
                                        <option key={index} value={project.id}>
                                            {project.name}
                                        </option>
                                    ))}
                                    </Field>
                                {/*</div>*/}
                               {errors.project && touched.project && <div>{errors.project}</div>}
                            </div>
                            <div className="form_item">
                                <label htmlFor="stages">* Stage(s) :</label>
                                <FieldArray
                                name="stages"
                                render={arrayHelpers => (
                                    <div className="form_item_div">
                                        <button className="form_item_button" type="button"  onClick={() => arrayHelpers.push({category: '', status: 'SCHEDULED'})}>
                                            Ajouter un Stage
                                        </button>
                                        {values.stages.map((stage, index) => (
                                            <div key={index} className="item_div">
                                                <label htmlFor="initialStage">Stage prévu :</label>
                                                <Field name={`stages[${index}].category`} id="initialStage"/>
                                                {index > 0 ? <button className="form_item_button" type="button" onClick={() => arrayHelpers.remove(index)}>
                                                    -Suppr-
                                                </button> : null}
                                                <ErrorMessage name={`stages[${index}].category`}/>
                                                {/*<ErrorMessage name="stages[0].category"/>*/}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                />
                                {typeof errors.stages === 'string' ? <div className="error_div">{errors.stages}</div> : null}
                            </div>
                            <div className="form_item">
                                <label htmlFor="urls">Url(s) :</label>
                                <FieldArray
                                name="urls"
                                render={arrayHelpers => (
                                    <div className="form_item_div">
                                        <button className="form_item_button" type="button"  onClick={() => arrayHelpers.push({link: '', alias:''})}>
                                            Ajouter un lien
                                        </button>
                                        {values.urls.map((url, index) => (
                                        <div className="add_url" key={'divUrl'+index}>
                                            <div key={index} className="item_div">
                                                <div key={'link'+index} className="item_div">
                                                    <label htmlFor="link">Lien : </label>
                                                    <Field name={`urls[${index}].link`} id="link" className="form_item_input"/>
                                                </div>
                                                <div key={'alias'+index}  className="item_div">
                                                    <label htmlFor="alias">Alias : </label>
                                                    <Field name={`urls[${index}].alias`} id="alias" className="form_item_input"/>
                                                </div>
                                            </div>
                                            <button key={'button '+index} className="form_item_button" type="button" onClick={() => arrayHelpers.remove(index)}>
                                                -Suppr-
                                            </button>
                                        </div>
                                        ))}
                                    </div>
                                )}
                                />
                            </div>
                            <div className="form_item">
                                <label htmlFor="comment">Commentaires :</label>
                                <Field as="textarea" className="form_item_input" type="text" name="comment" id={"comment"} />
                            </div>
                            <button className="form_item_button" type="submit" disabled={isSubmitting}>
                                Submit
                            </button>
                            <div id="prerequis">(*) Élements obligatoires</div>
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

export default FormRelease;