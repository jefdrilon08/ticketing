import React, { useState, useEffect } from 'react';
import SkCubeLoading from '../../SkCubeLoading';
import Filter from './Filter';
import MasterListView from './MasterListView';
import RepaymentRatesView from './RepaymentRatesView';
import AgingOfReceivablesView from './AgingOfReceivablesView';

import { fetchRepaymentRate } from '../../../services/RepaymentRatesService';

export default ShowComponent = (props) => {
  const [isLoading, setIsLoading]                       = useState(true);
  const [data, setData]                                 = useState(false);
  const [centers, setCenters]                           = useState([]);
  const [officers, setOfficers]                         = useState([]);
  const [loanProducts, setLoanProducts]                 = useState([]);
  const [currentOfficerId, setCurrentOfficerId]         = useState("");
  const [currentCenterId, setCurrentCenterId]           = useState("");
  const [currentLoanProductId, setCurrentLoanProductId] = useState("");
  const [currentView, setCurrentView]                   = useState("RR");

  let {
    id
  } = props;

  const filterData = () => {
    let fData = {...data};

    if (currentCenterId) {
      fData.records = fData.records.filter((o) => {
        return o.center.id == currentCenterId;
      });
    }

    if (currentOfficerId) {
      fData.records = fData.records.filter((o) => {
        return o.officer.id == currentOfficerId;
      });
    }

    if (currentLoanProductId) {
      fData.records = fData.records.filter((o) => {
        return o.loan_product.id == currentLoanProductId;
      });
    }

    return fData;
  }

  const fetch = (options) => {
    var data  = {
      center_id: currentCenterId,
      loan_product_id: currentLoanProductId,
      officer_id: currentOfficerId
    }

    console.log("fetch (data):");
    console.log(data);

    fetchRepaymentRate(id, {...data})
      .then((payload) => {
        console.log(payload);
        let _data = payload.data.data;
        setIsLoading(false);
        setData(_data);
        setCenters(_data.centers);
        setLoanProducts(_data.loan_products);
        setOfficers(_data.officers);
      }).catch((payload) => {
        console.log(payload);
        alert("Something went wrong when fetching data store");
      })
  }

  useEffect(() => {
    fetch();
  }, []);

  const handleCenterChanged = (event) => {
    setCurrentCenterId(event.target.value);
    $.ajax({
      url: "/api/v1/data_stores/repayment_rates/fetch",
      data: {
        id: context.props.id
      },
      headers: {
        'X-KOINS-APP-AUTH-SECRET': context.state.xKoinsAppAuthSecret,
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
      },
      method: 'GET',
      success: function(response) {
        console.log(response);

        var centers       = response.data.centers;

        context.setState({
          isLoading: false,
          data: response,
          centers: centers
        });
      },
      error: function(response) {
        console.log(response);
        alert("Something went wrong when fetching data store");
      }
    });
    
    $("#btn-print-rp").on("click", function() {
      var url = "/print";
      var params = "?type=repayment_rates&id=" + context.state.data.id;
      if (context.state.currentCenterId.length > 0){
        params = params + "&center_id=" + context.state.currentCenterId;
      }
      if (context.state.currentLoanProductId.length > 0){
        params = params + "&loan_product_id=" + context.state.currentLoanProductId;
      }
      if (context.state.currentOfficerId.length > 0){
        params = params + "&officer_id=" + context.state.currentOfficerId;
      }
      url = url + params;
      window.open(url, '_blank', 'noopener');
    });

    $("#btn-print-rp").on('contextmenu', function(event) {
      event.preventDefault();
    });
  }

  const handleOfficerChanged = (event) => {
    setCurrentOfficerId(event.target.value);
  }

  const handleLoanProductChanged = (event) => {
    setCurrentLoanProductId(event.target.value);
  }

  const handleViewToggled = (viewName) => {
    setCurrentView(viewName);
  }

  if (isLoading) {
    return  (
      <SkCubeLoading/>
    );
  } else if (currentView == "RR") {
    return  (
      <div>
        <Filter
          currentView={currentView} 
          handleViewToggled={handleViewToggled}
          centers={centers}
          officers={officers}
          loanProducts={loanProducts}
          currentCenterId={currentCenterId}
          currentLoanProductId={currentLoanProductId}
          handleCenterChanged={handleCenterChanged}
          handleLoanProductChanged={handleLoanProductChanged}
          handleOfficerChanged={handleOfficerChanged}
        />
        <hr/>
        <RepaymentRatesView
          data={filterData()}
        />
      </div>
    );
  } else if (currentView == "AOR") {
    return  (
      <div>
        <Filter
          currentView={currentView} 
          handleViewToggled={handleViewToggled}
          centers={centers}
          officers={officers}
          loanProducts={loanProducts}
          currentCenterId={currentCenterId}
          currentLoanProductId={currentLoanProductId}
          handleCenterChanged={handleCenterChanged}
          handleLoanProductChanged={handleLoanProductChanged}
          handleOfficerChanged={handleOfficerChanged}
        />
        <hr/>
        <AgingOfReceivablesView
          data={filterData()}
        />
      </div>
    );
  } else if (currentView == "ML") {
    return  (
      <div>
        <Filter
          currentView={currentView} 
          handleViewToggled={handleViewToggled}
          centers={centers}
          officers={officers}
          loanProducts={loanProducts}
          currentCenterId={currentCenterId}
          currentLoanProductId={currentLoanProductId}
          handleCenterChanged={handleCenterChanged}
          handleLoanProductChanged={handleLoanProductChanged}
          handleOfficerChanged={handleOfficerChanged}
        />
        <hr/>
        <MasterListView
          data={filterData()}
        />
      </div>
    );
  } else {
    return  (
      <div>
        <p>
          Invalid view name: {currentView}
        </p>
      </div>
    );
  }
}
