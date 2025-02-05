require("@rails/ujs").start();

import $ from 'jquery';

import React from 'react';
import { createRoot } from "react-dom/client";
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import * as bootstrap from "bootstrap";

import consumer from "../channels/consumer";

// React Components
import DashboardMainUI from "../components/dashboard/MainUI";


import Login from "../components/users/Login.js";
import AdministrationUsersForm from "../components/administration/users/Form.js";
import AdministrationUsersIndex from "../components/administration/users/Index.js";
import AdministrationUsersShow from "../components/administration/users/Show.js";


// "init" Objects
import Dashboard from "../models/Dashboard.js";
import Sidebar from "../models/Sidebar.js";
import UserDemeritsShow from "../models/UserDemeritsShow.js";
import AdministrationAreasIndex from "../models/AdministrationAreasIndex.js";
import AdministrationClustersIndex from "../models/AdministrationClustersIndex.js";
import AdministrationBranchesIndex from "../models/AdministrationBranchesIndex.js";
import AdministrationBranchesShow from "../components/administration/branches/Show.js";
import AdministrationCentersShow from "../components/administration/centers/Show.js";
import AdministrationComputerSystemIndex from '../models/AdministrationComputerSystemIndex.js';

//const renderComponent = (Component, payload) => {
//  ReactDOM.render(
//    <Component {...payload} />,
//    document.getElementById("react-root"),
//  )
//}
//>>>>>>> Instapay_Pesonet

const hooks = {
  "pages/index":                                      [DashboardMainUI, Dashboard],
  "pages/login":                                      [Login],
  "administration/users/new":                         [AdministrationUsersForm],
  "administration/users/edit":                        [AdministrationUsersForm],
  "administration/users/index":                       [AdministrationUsersIndex],
  "administration/users/show":                        [AdministrationUsersShow],
  "administration/user_demerits/show":                [UserDemeritsShow],
  "administration/areas/index":                       [AdministrationAreasIndex],
  "administration/clusters/index":                    [AdministrationClustersIndex],
  "administration/branches/index":                    [AdministrationBranchesIndex],
  "administration/branches/show":                     [AdministrationBranchesShow],
  "administration/centers/show":                      [AdministrationCentersShow],
  "administration/computer_system/index":             [AdministrationComputerSystemIndex],
}

const renderComponent = (Component, payload) => {
  const rootElement = document.getElementById("react-root");
  const root        = createRoot(rootElement);

  root.render(
    <Component {...payload} />
  )
}

document.addEventListener("DOMContentLoaded", () => {
  const { route, payload } = JSON.parse($("meta[name='parameters']").attr('content'));
  const authenticityToken = $("meta[name='csrf-token']").attr('content');
  const options = { authenticityToken, ...payload }

  const components = hooks[route];
  if (components) {
    components.forEach((component) => {
      if (typeof component.init === "function") {
        // "init" object
        component.init(options)
      } else {
        // React component
        renderComponent(component, options)
      }
    })
  }

  if(route != "pages/login") {
    // SIDEBAR JS
    Sidebar.init();
  }
});
