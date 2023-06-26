import React, {ChangeEvent, FormEvent, useState} from 'react';
import './FormLogin.scss'
import {useAppStore} from "../../providers/RootStoreProvider";
import {observer} from "mobx-react-lite";
import {Navigate} from "react-router-dom";
import {client, getToken} from "../../helpers/AuthenticationHelper";


const FormLogin = () => {

    const [nameForm, setNameForm] = useState('');
    const [passwordForm, setPasswordForm] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [token, setToken] = useState(getToken())

    const {authenticated, login} = useAppStore()

    const handleNameInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setNameForm(event.target.value);
    };

    const handlePasswordInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPasswordForm(event.target.value);
    };

    async function loginCall() {
        try {
            const response = await client.request({
                method:'POST',
                url: 'login_check',
                data:{
                    "username": nameForm,
                    "password": passwordForm
                }
            })
            login(response.data.token)
            setToken(response.data.token)
        } catch (error) {
           setErrorMessage('Identifiant ou mot de passe incorrect.');
        }
    }


    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        if ((nameForm !== '') && (passwordForm !== '')) {
            loginCall();
        } else {
            setErrorMessage('Veuillez remplir tous les champs du formulaire.')
        }
    }
    if (!authenticated) {
        return (
            <div>
                <h2> Pour accéder au site, merci de vous connecter :</h2>
                <form id="form_login" onSubmit={handleSubmit}>
                    <div className="form_item">
                        <label className="form_item_label">Username :</label>
                        <input className="form_item_input" type='text' name="username" value={nameForm}
                               onChange={handleNameInputChange}/>
                    </div>
                    <div className="form_item">
                        <label className="form_item_label">Password :</label>
                        <input className="form_item_input" type='password' name='password' value={passwordForm}
                               onChange={handlePasswordInputChange}/>
                    </div>
                    <div className="form_item">
                        <input id="form_item_button" type="submit" value={"Log In"}/>
                    </div>
                </form>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
            </div>
        )
    } else {
       return <Navigate to="/" replace={true}/>
    }
}

export default FormLogin;