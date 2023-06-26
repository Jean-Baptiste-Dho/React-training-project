import React from 'react';
import logo from './logo.svg';
import './App.scss';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import NoPage from "./components/NoPage/NoPage";
import Me from "./components/Me/Me";
import Navigation from "./components/Navigation/Navigation";
import Home from "./components/Home/Home";
import FormLogin from "./components/FormLogin/FormLogin";
import FormRelease from "./components/Release/FormRelease";
import FormIssue from "./components/Issue/FormIssue";
import Releases from "./components/Release/Releases";
import Issue from "./components/Issue/Issue";
import {RootStoreProvider} from "./providers/RootStoreProvider";
import Release from "./components/Release/Release";

import { library } from '@fortawesome/fontawesome-svg-core'
import {faPen, faPlus, faXmark, faTrash, faLock} from '@fortawesome/free-solid-svg-icons'
import Dashboard from "./components/Dashboard/Dashboard";

  library.add(faPen, faXmark, faPlus, faTrash, faLock)

function App() {
  return (
    <div className="App">
        <RootStoreProvider>
          <BrowserRouter>
              <Routes>
                  <Route path='/' element={<Navigation />}>
                      <Route index element={<Home />}/>
                      <Route path="login" element={<FormLogin />}/>
                      <Route path="releases" element={<Releases />}/>
                      {/*<Route path="formRelease" element={<FormRelease />}/>*/}
                      <Route path="dashboard" element={<Dashboard />}/>
                      {/*<Route path="formIssue" element={<FormIssue />}/>*/}
                      <Route path="me" element={<Me />}/>
                      <Route path="release/:id" element={<Release />}/>
                      <Route path="*" element={<NoPage />} />
                  </Route>
              </Routes>
          </BrowserRouter>
        </RootStoreProvider>
    </div>
  );
}

export default App;
