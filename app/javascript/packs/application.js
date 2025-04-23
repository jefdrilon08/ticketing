import Rails from "@rails/ujs"
Rails.start()

import $ from 'jquery';
import './items';
import "./inventory_request_modal"

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
import AdministrationItemsIndex from '../models/AdministrationItemsIndex.js';
import AdministrationItemsCategoryIndex from '../models/AdministrationItemsCategoryIndex.js';
import AdministrationSuppliersIndex from '../models/AdministrationSuppliersIndex.js';
import ItemRequestIndex from '../models/ItemRequestIndex.js';
import BorrowTransactionsIndex from '../models/BorrowTransactionsIndex.js';
import ConcernTicketIndex from '../models/ConcernTicketIndex.js';
import ConcernTicketShow from '../models/ConcernTicketShow.js';
import InventoryRequest from '../models/InventoryRequestShow.js';


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
  "borrow_transactions/index":                        [BorrowTransactionsIndex],
  "item_request/index":                               [ItemRequestIndex],

  // "concern_tickets/index":                            [ConcernTicketIndex],
  "concern_tickets/new_concern":                      [ConcernTicketIndex],
  "concern_tickets/show":                             [ConcernTicketShow],

  "administration/computer_system/index":             [AdministrationComputerSystemIndex],
  "administration/items/index":                       [AdministrationItemsIndex],
  "administration/items_category/index":              [AdministrationItemsCategoryIndex],
  "administration/suppliers/index":                   [AdministrationSuppliersIndex],

  "inventory_requests/show":                          [InventoryRequest],


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
