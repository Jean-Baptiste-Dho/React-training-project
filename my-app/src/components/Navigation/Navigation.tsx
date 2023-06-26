import React from 'react';
import './Navigation.scss';
import {Link, Outlet} from "react-router-dom";
import {observer} from "mobx-react-lite";
import {useAppStore} from "../../providers/RootStoreProvider";

const Navigation = observer((props: any) => {

    const {authenticated, logout} = useAppStore()
    const LOGIN = "Login"
    const LOGOUT = "Logout"

    return (
        <>
            <div className={"navigation"}>
                <nav>
                    <span>
                        <Link className='link' to="/releases">Releases</Link>
                    </span>
                    {/*<span>*/}
                    {/*    <Link className='link' to="/formRelease">FormRelease</Link>*/}
                    {/*</span>*/}
                    <span>
                        <Link className='link' to="/dashboard">Dashboard</Link>
                    </span>
                    {/*<span>*/}
                    {/*    <Link className='link' to="/formIssue">FormIssue</Link>*/}
                    {/*</span>*/}
                    <span>
                        <Link className='link' to="/me">About Me</Link>
                    </span>
                    <div>
                    {authenticated ? <span>
                        <a href="/login" onClick={logout}>{LOGOUT}</a>
                    </span> : <span>
                        <Link className='link' to="/login">{LOGIN}</Link>
                    </span>}
                    </div>
                </nav>
            </div>

                <Outlet />
        </>
    )
})

export default Navigation;