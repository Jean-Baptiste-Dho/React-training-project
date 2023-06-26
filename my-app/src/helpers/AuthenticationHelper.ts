import axios from "axios";

export const TOKEN_KEY = 'token'

export const client = axios.create({
        baseURL: 'https://monitoring.ddev.site/api/',
        // withCredentials: true,
        timeout: 1000,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        }
    });
export const getToken = () : string | null  => {
    const token = localStorage.getItem(TOKEN_KEY)

    if (token) {
        return token
    }
    return null
}


 export async function refreshToken(name : string, password : string) {
        try {
            const response = await client.request({
                method:'POST',
                url: 'login_check',
                data:{
                    "username": name,
                    "password": password
                }
            })
            return response.data.refresh_token
        } catch (error) {
            console.error("Error:", Error);
        }
    }


export const isAuthenticated = (): boolean  => {
    // return getToken() ? true : false
    return !!getToken()
}

export async function sendRequest (method: string, path: string, data:any=null ){
    try {
        const response = await client.request({
            method: method,
            url: path,
            headers: {
                // Accept: "application/json",
                // "Content-Type": "application/json",
                Authorization: "Bearer " + getToken()
            },
            data : data
        });

        if (response.status.toString().charAt(0) === '2') {
                // console.log(response.ok)
               return response.data;
        } else {
            console.error("Error:", Error);
            return false
        }

    } catch (error) {
        // throw new Error('We cannot grant you the rank of Master...')
    }
}

