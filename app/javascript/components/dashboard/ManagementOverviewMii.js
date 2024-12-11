import React from 'react';
import $ from 'jquery';

import SkCubeLoading from '../SkCubeLoading';
import {numberAsPercent, numberWithCommas} from '../utils/helpers';

export default class ManagementOverviewMii extends React.Component {
  constructor(props) {
    super(props);

    this.state  = {
      isLoading: true,
      isFetching: false,
      data: false,
      asOf: "",
    }
  }

  componentDidMount() {
    this.fetch();
  }

  fetch() {
    var context = this;

    $.ajax({
      method: 'GET',
      url: '/api/v1/dashboard_mii/overview_mii',
      data: {
        as_of: context.state.asOf
      },
      success: function(response) {
        console.log(response);

        context.setState({
          isLoading: false,
          isFetching: false,
          data: response
        });
      },
      error: function(response) {
        console.log(response);
        alert("Error in fetching overview mii data");
      }
    });
  }

  handleSyncClicked() {
    this.setState({
      isFetching: true
    });

    this.fetch();
  }

  handleAsOfChanged(event) {
    this.setState({
      asOf: event.target.value
    });
  }

  renderOverviewTable() {
    var areas   = this.state.data.areas;
    var areas_kcoop   = this.state.data.areas_kcoop;
    var rows    = [];
    var colSpan = 13;

    var areaColor     = "#bad5fd";
    var clusterColor  = "#c5ffc1";
    var branchColor   = "#797979";

    var tTotalLife        = 0.00;
    var tTotalRf          = 0.00;
    var tTotalLifeRf      = 0.00;
    var tActiveMembers    = 0;
    var tInforceMembers   = 0;
    var tLapsedMembers    = 0;
    var tPendingMembers   = 0;
    var tDormantMembers   = 0;
    var tResignedActiveMembers = 0;

    for(var i = 0; i < areas.length; i++) {
      rows.push(
        <tr key={"area-" + areas[i].id} style={{backgroundColor: areaColor}}>
          <th className="text-center" colSpan={colSpan}>
            {areas[i].name}
          </th>
        </tr>
      );
     
      var clusters    = areas[i].clusters;

      var aTotalLife        = 0.00;
      var aTotalRf          = 0.00;
      var aTotalLifeRf      = 0.00;
      var aActiveMembers    = 0;
      var aInforceMembers   = 0;
      var aLapsedMembers    = 0;
      var aPendingMembers   = 0;
      var aDormantMembers   = 0;
      var aResignedActiveMembers = 0;

      for(var j = 0; j < clusters.length; j++) {
        rows.push(
          <tr key={"cluster-" + clusters[j].id} style={{backgroundColor: clusterColor}}>
            <th className="text-center" colSpan={colSpan}>
              {clusters[j].name}
            </th>
          </tr>
        );

        var branches  = clusters[j].branches;

        var cTotalLife        = 0.00;
        var cTotalRf          = 0.00;
        var cTotalLifeRf      = 0.00;
        var cActiveMembers    = 0;
        var cInforceMembers   = 0;
        var cLapsedMembers    = 0;
        var cPendingMembers   = 0;
        var cDormantMembers   = 0;
        var cResignedActiveMembers = 0;

        for(var k = 0; k < branches.length; k++) {
          if(k == 0) {
            rows.push(
              <tr key={"header-" + branches[k].id} style={{backgroundColor: branchColor, color: "white"}}>
                <th>
                  Branch Name
                </th>
                <th className="text-center">
                  Inforce
                </th>
                <th className="text-center">
                  Lapsed
                </th>
                <th className="text-center">
                  Pending
                </th>
                <th className="text-center">
                  Dormant
                </th>
                <th className="text-center">
                  Resigned Active
                </th>
                <th className="text-center">
                  Active Members
                </th>
                <th>
                  As Of (Member Count)
                </th>
                <th className="text-center">
                  LIFE
                </th>
                <th className="text-center">
                  RF
                </th>
                <th>
                  As Of (Personal Fund)
                </th>
              </tr>
            );
          }

          cTotalLife        += branches[k].data.total_life
          cTotalRf          += branches[k].data.total_rf
          cActiveMembers    += branches[k].data.active_members.total;
          cInforceMembers   += branches[k].data.inforce_members.total;
          cLapsedMembers    += branches[k].data.lapsed_members.total;
          cPendingMembers   += branches[k].data.pending_members.total;
          cDormantMembers   += branches[k].data.dormant_members.total;
          cResignedActiveMembers += branches[k].data.resigned_active_members.total;

          aTotalLife        += branches[k].data.total_life
          aTotalRf          += branches[k].data.total_rf
          aActiveMembers    += branches[k].data.active_members.total;
          aInforceMembers   += branches[k].data.inforce_members.total;
          aLapsedMembers    += branches[k].data.lapsed_members.total;
          aPendingMembers   += branches[k].data.pending_members.total;
          aDormantMembers   += branches[k].data.dormant_members.total;
          aResignedActiveMembers += branches[k].data.resigned_active_members.total;

          tTotalLife        += branches[k].data.total_life
          tTotalRf          += branches[k].data.total_rf
          tActiveMembers    += branches[k].data.active_members.total;
          tInforceMembers   += branches[k].data.inforce_members.total;
          tLapsedMembers    += branches[k].data.lapsed_members.total;
          tPendingMembers   += branches[k].data.pending_members.total;
          tDormantMembers   += branches[k].data.dormant_members.total;
          tResignedActiveMembers += branches[k].data.resigned_active_members.total;

          rows.push(
            <tr key={"branch-" + branches[k].id}>
              <td>
                <strong>
                  {branches[k].name}
                </strong>
              </td>
              <td className="text-center">
                {branches[k].data.inforce_members.total}
              </td>
              <td className="text-center">
                {branches[k].data.lapsed_members.total}
              </td>
              <td className="text-center">
                {branches[k].data.pending_members.total}
              </td>
              <td className="text-center">
                {branches[k].data.dormant_members.total}
              </td>
              <td className="text-center">
                {branches[k].data.resigned_active_members.total}
              </td>
              <td className="text-center">
                {branches[k].data.active_members.total}
              </td>
              <td className="text-center">
                {branches[k].data.member_counts_as_of}
              </td>
              <td className="text-center">
                {numberWithCommas(branches[k].data.total_life)}
              </td>
              <td className="text-center">
                {numberWithCommas(branches[k].data.total_rf)}
              </td>
              <td className="text-center">
                {branches[k].data.personal_funds_as_of}
              </td>
            </tr>
          );
        }

        rows.push(
          <tr key={"cluster-total-" + clusters[j].id} style={{backgroundColor: clusterColor}}>
            <td>
              <strong>
                {clusters[j].name} Total
              </strong>
            </td>
            <td className="text-center">
              <strong>
                {cInforceMembers}
              </strong>
            </td>
            <td className="text-center">
              <strong>
                {cLapsedMembers}
              </strong>
            </td>
            <td className="text-center">
              <strong>
                {cPendingMembers}
              </strong>
            </td>
            <td className="text-center">
              <strong>
                {cDormantMembers}
              </strong>
            </td>
            <td className="text-center">
              <strong>
                {cResignedActiveMembers}
              </strong>
            </td>
            <td className="text-center">
              <strong>
                {cActiveMembers}
              </strong>
            </td>
            <td>
            </td>
            <td className="text-center">
              <strong>
                {numberWithCommas(cTotalLife)}
              </strong>
            </td>
            <td className="text-center">
              <strong>
                {numberWithCommas(cTotalRf)}
              </strong>
            </td>
            <td>
            </td>
          </tr>
        );
      }

      rows.push(
        <tr key={"area-total-" + areas[i].id} style={{backgroundColor: areaColor}}>
          <td>
            <strong>
              {areas[i].name} Total
            </strong>
          </td>
          <td className="text-center">
            <strong>
              {aInforceMembers}
            </strong>
          </td>
          <td className="text-center">
            <strong>
              {aLapsedMembers}
            </strong>
          </td>
          <td className="text-center">
            <strong>
              {aPendingMembers}
            </strong>
          </td>
          <td className="text-center">
            <strong>
              {aDormantMembers}
            </strong>
          </td>
          <td className="text-center">
            <strong>
              {aResignedActiveMembers}
            </strong>
          </td>
          <td className="text-center">
            <strong>
              {aActiveMembers}
            </strong>
          </td>
          <td>
          </td>
          <td className="text-center">
            <strong>
              {numberWithCommas(aTotalLife)}
            </strong>
          </td>
          <td className="text-center">
            <strong>
              {numberWithCommas(aTotalRf)}
            </strong>
          </td>
          <td>
          </td>
        </tr>
      );
    }


    rows.push(
      <tr key={"grand-total"} style={{backgroundColor: "#000", color: "#fff"}}>
        <td>
          <strong>
            Grand Total
          </strong>
        </td>
        <td className="text-center">
          <strong>
            {tInforceMembers}
          </strong>
        </td>
        <td className="text-center">
          <strong>
            {tLapsedMembers}
          </strong>
        </td>
        <td className="text-center">
          <strong>
            {tPendingMembers}
          </strong>
        </td>
        <td className="text-center">
          <strong>
            {tDormantMembers}
          </strong>
        </td>
        <td className="text-center">
          <strong>
            {tResignedActiveMembers}
          </strong>
        </td>
        <td className="text-center">
          <strong>
            {tActiveMembers}
          </strong>
        </td>
        <td>
        </td>
        <td className="text-center">
          <strong>
            {numberWithCommas(tTotalLife)}
          </strong>
        </td>
        <td className="text-center">
          <strong>
            {numberWithCommas(tTotalRf)}
          </strong>
        </td>
        <td>
        </td>
      </tr>
    );

    return (
      <table className="table table-sm table-bordered">
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }

  renderOverviewTableSummary() {
    var areas   = this.state.data.areas;
    var rows    = [];
    var colSpan = 13;

    var areaColor     = "#bad5fd";
    var clusterColor  = "#c5ffc1";
    var branchColor   = "#797979";

    var tTotalLife        = 0.00;
    var tTotalRf          = 0.00;
    var tTotalLifeRf      = 0.00;
    var tActiveMembers    = 0;
    var tInforceMembers   = 0;
    var tLapsedMembers    = 0;
    var tPendingMembers   = 0;
    var tDormantMembers   = 0;
    var tResignedActiveMembers = 0;

    var kmbaAssociatetTotalLife                 = 0.00;
    var kmbaAssociatetTotalRf                   = 0.00;              
    var kmbaAssociatetActiveMembers             = 0.00;        
    var kmbaAssociatetInforceMembers            = 0.00;     
    var kmbaAssociatetLapsedMembers             = 0.00;             
    var kmbaAssociatetPendingMembers            = 0.00;            
    var kmbaAssociatetDormantMembers            = 0.00;            
    var kmbaAssociatetResignedActiveMembers     = 0.00;

    var kcoopAssociatetTotalLife                 = 0.00;
    var kcoopAssociatetTotalRf                   = 0.00;              
    var kcoopAssociatetActiveMembers             = 0.00;        
    var kcoopAssociatetInforceMembers            = 0.00;     
    var kcoopAssociatetLapsedMembers             = 0.00;             
    var kcoopAssociatetPendingMembers            = 0.00;            
    var kcoopAssociatetDormantMembers            = 0.00;            
    var kcoopAssociatetResignedActiveMembers     = 0.00;      
      

    rows.push(
      <tr style={{backgroundColor: areaColor}}>
        <th className="text-center" colSpan={colSpan}>
          <h4>        
            MEMBERS REPORT SUMMARY
          </h4>  
        </th>
      </tr>
    );

    rows.push(
      <tr key={"header-"} style={{backgroundColor: branchColor, color: "white"}}>
        <th>
          Area Name
        </th>
        <th className="text-center">
          Inforce
        </th>
        <th className="text-center">
          Lapsed
        </th>
        <th className="text-center">
          Pending
        </th>
        <th className="text-center">
          Dormant
        </th>
        <th className="text-center">
          LIFE
        </th>
        <th className="text-center">
          RF
        </th>
      </tr>
    );

    for(var i = 0; i < areas.length; i++) {
      
     
      var clusters    = areas[i].clusters;

      var aTotalLife        = 0.00;
      var aTotalRf          = 0.00;
      var aTotalLifeRf      = 0.00;
      var aActiveMembers    = 0;
      var aInforceMembers   = 0;
      var aLapsedMembers    = 0;
      var aPendingMembers   = 0;
      var aDormantMembers   = 0;
      var aResignedActiveMembers = 0;

      for(var j = 0; j < clusters.length; j++) {
        var branches  = clusters[j].branches;

        var cTotalLife        = 0.00;
        var cTotalRf          = 0.00;
        var cTotalLifeRf      = 0.00;
        var cActiveMembers    = 0;
        var cInforceMembers   = 0;
        var cLapsedMembers    = 0;
        var cPendingMembers   = 0;
        var cDormantMembers   = 0;
        var cResignedActiveMembers = 0;

        for(var k = 0; k < branches.length; k++) {
          if(k == 0) {
            
          }

          cTotalLife        += branches[k].data.total_life
          cTotalRf          += branches[k].data.total_rf
          cActiveMembers    += branches[k].data.active_members.total;
          cInforceMembers   += branches[k].data.inforce_members.total;
          cLapsedMembers    += branches[k].data.lapsed_members.total;
          cPendingMembers   += branches[k].data.pending_members.total;
          cDormantMembers   += branches[k].data.dormant_members.total;
          cResignedActiveMembers += branches[k].data.resigned_active_members.total;

          aTotalLife        += branches[k].data.total_life
          aTotalRf          += branches[k].data.total_rf
          aActiveMembers    += branches[k].data.active_members.total;
          aInforceMembers   += branches[k].data.inforce_members.total;
          aLapsedMembers    += branches[k].data.lapsed_members.total;
          aPendingMembers   += branches[k].data.pending_members.total;
          aDormantMembers   += branches[k].data.dormant_members.total;
          aResignedActiveMembers += branches[k].data.resigned_active_members.total;

          if (i < 3) {
            kmbaAssociatetTotalLife                   += branches[k].data.total_life
            kmbaAssociatetTotalRf                     += branches[k].data.total_rf
            kmbaAssociatetActiveMembers               += branches[k].data.active_members.total;
            kmbaAssociatetInforceMembers              += branches[k].data.inforce_members.total;
            kmbaAssociatetLapsedMembers               += branches[k].data.lapsed_members.total;
            kmbaAssociatetPendingMembers              += branches[k].data.pending_members.total;
            kmbaAssociatetDormantMembers              += branches[k].data.dormant_members.total;
            kmbaAssociatetResignedActiveMembers       += branches[k].data.resigned_active_members.total;
            var areaName = "KMBA Associate";

          } else {
            kcoopAssociatetTotalLife                   += branches[k].data.total_life
            kcoopAssociatetTotalRf                     += branches[k].data.total_rf
            kcoopAssociatetActiveMembers               += branches[k].data.active_members.total;
            kcoopAssociatetInforceMembers              += branches[k].data.inforce_members.total;
            kcoopAssociatetLapsedMembers               += branches[k].data.lapsed_members.total;
            kcoopAssociatetPendingMembers              += branches[k].data.pending_members.total;
            kcoopAssociatetDormantMembers              += branches[k].data.dormant_members.total;
            kcoopAssociatetResignedActiveMembers       += branches[k].data.resigned_active_members.total;
            var areaName = "KCOOP";
          }


          tTotalLife        += branches[k].data.total_life
          tTotalRf          += branches[k].data.total_rf
          tActiveMembers    += branches[k].data.active_members.total;
          tInforceMembers   += branches[k].data.inforce_members.total;
          tLapsedMembers    += branches[k].data.lapsed_members.total;
          tPendingMembers   += branches[k].data.pending_members.total;
          tDormantMembers   += branches[k].data.dormant_members.total;
          tResignedActiveMembers += branches[k].data.resigned_active_members.total;
        }
      }

      rows.push(
        <tr key={"area-total-" + areas[i].id}>
          <td>
            <strong>
              {areas[i].name}
            </strong>
          </td>
          <td className="text-center">
            <strong>
              {aInforceMembers}
            </strong>
          </td>
          <td className="text-center">
            <strong>
              {aLapsedMembers}
            </strong>
          </td>
          <td className="text-center">
            <strong>
              {aPendingMembers}
            </strong>
          </td>
          <td className="text-center">
            <strong>
              {aDormantMembers}
            </strong>
          </td>
          <td className="text-center">
            <strong>
              {numberWithCommas(aTotalLife)}
            </strong>
          </td>
          <td className="text-center">
            <strong>
              {numberWithCommas(aTotalRf)}
            </strong>
          </td>
        </tr>
      );
    }

    rows.push(
      <tr key={"subtotal-kmba-associate"} style={{backgroundColor: "#696", color: "#fff"}}>
        <th>
          KMBA Associate Sub Total 
        </th>
        <th className="text-center">
          {kmbaAssociatetInforceMembers}
        </th>
        <th className="text-center">
          {kmbaAssociatetLapsedMembers}
        </th>
        <th className="text-center">
          {kmbaAssociatetPendingMembers}
        </th>
        <th className="text-center">
          {kmbaAssociatetDormantMembers}
        </th>
        <th className="text-center">
          {numberWithCommas(kmbaAssociatetTotalLife)}
        </th>
        <th className="text-center">
          {numberWithCommas(kmbaAssociatetTotalRf)}
        </th>
      </tr>
    );

    rows.push(
      <tr key={"subtotal-kcoop"} style={{backgroundColor: "#696", color: "#fff"}}>
        <th>
          KCOOP Sub Total 
        </th>
        <th className="text-center">
          {kcoopAssociatetInforceMembers}
        </th>
        <th className="text-center">
          {kcoopAssociatetLapsedMembers}
        </th>
        <th className="text-center">
          {kcoopAssociatetPendingMembers}
        </th>
        <th className="text-center">
          {kcoopAssociatetDormantMembers}
        </th>
        <th className="text-center">
          {numberWithCommas(kcoopAssociatetTotalLife)}
        </th>
        <th className="text-center">
          {numberWithCommas(kcoopAssociatetTotalRf)}
        </th>
      </tr>
    );

    rows.push(
      <tr key={"grand-total"} style={{backgroundColor: "#000", color: "#fff"}}>
        <td>
          <strong>
            Grand Total
          </strong>
        </td>
        <td className="text-center">
          <strong>
            {tInforceMembers}
          </strong>
        </td>
        <td className="text-center">
          <strong>
            {tLapsedMembers}
          </strong>
        </td>
        <td className="text-center">
          <strong>
            {tPendingMembers}
          </strong>
        </td>
        <td className="text-center">
          <strong>
            {tDormantMembers}
          </strong>
        </td>
        <td className="text-center">
          <strong>
            {numberWithCommas(tTotalLife)}
          </strong>
        </td>
        <td className="text-center">
          <strong>
            {numberWithCommas(tTotalRf)}
          </strong>
        </td>
      </tr>
    );

    return (
      <table className="table table-sm table-bordered">
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }

  renderOverviewTableClaims() {
    var areas   = this.state.data.areas;
    var rows    = [];
    var colSpan = 13;

    var areaColor     = "#bad5fd";
    var clusterColor  = "#c5ffc1";
    var branchColor   = "#797979";

    var tTotalBLip                = 0.00;
    var tTotalClip                = 0.00;
    var tTotalHiip                = 0.00;
    var tTotalKbente              = 0.00;
    var tTotalKkalinga            = 0.00;
    var tTotalKjsp                = 0.00;
    var tTotalCalamityAssistance  = 0.00;
    var tBlip                     = 0;
    var tClip                     = 0;
    var tHiip                     = 0;
    var tKbente                   = 0;
    var tKkalinga                 = 0;
    var tKjsp                     = 0;
    var tCalamityAssistance       = 0;

    rows.push(
      <tr style={{backgroundColor: areaColor}}>
        <th className="text-center" colSpan={colSpan}>
          <h4>        
            CLAIMS COUNTS PER BRANCH
          </h4>  
        </th>
      </tr>
    );

    rows.push(
      <tr style={{backgroundColor: branchColor, color: "white"}}>
        <th>
          Branch Name
        </th>
        <th className="text-center">
          BLIP
        </th>
        <th className="text-center">
          CLIP
        </th>
        <th className="text-center">
          HIIP
        </th>
        <th className="text-center">
          K-BENTE
        </th>
        <th className="text-center">
          K-KALINGA
        </th>
        <th className="text-center">
          CALAMITY ASSISTANCE
        </th>
        <th className="text-center">
          KJSP
        </th>
        <th>
          As Of (Claim Counts)
        </th>
      </tr>
    );

    for(var i = 0; i < areas.length; i++) {
     
      var clusters    = areas[i].clusters;

      for(var j = 0; j < clusters.length; j++) {

        var branches  = clusters[j].branches;

        for(var k = 0; k < branches.length; k++) {
        

          tTotalBLip                += branches[k].data.total_blip_claims;
          tTotalClip                += branches[k].data.total_clip_claims;
          tTotalHiip                += branches[k].data.total_hiip_claims;
          tTotalKbente              += branches[k].data.total_kbente_claims;
          tTotalKkalinga            += branches[k].data.total_kkalinga_claims;
          tTotalKjsp                += branches[k].data.total_kjsp_claims;
          tTotalCalamityAssistance  += branches[k].data.total_calamity_assistance_claims;
          tBlip                     += branches[k].data.approved_claims.blip;
          tClip                     += branches[k].data.approved_claims.clip;
          tHiip                     += branches[k].data.approved_claims.hiip;
          tKbente                   += branches[k].data.approved_claims.k_bente;
          tKkalinga                 += branches[k].data.approved_claims.k_kalinga;
          tKjsp                     += branches[k].data.approved_claims.kjsp;
          tCalamityAssistance       += branches[k].data.approved_claims.calamity_assistance;

          rows.push(
            <tr key={"branch-" + branches[k].id}>
              <td>
                <strong>
                  {branches[k].name}
                </strong>
              </td>
              <td className="text-center">
                {branches[k].data.approved_claims.blip}
              </td>
              <td className="text-center">
                {branches[k].data.approved_claims.clip}
              </td>
              <td className="text-center">
                {branches[k].data.approved_claims.hiip}
              </td>
              <td className="text-center">
                {branches[k].data.approved_claims.k_bente}
              </td>
              <td className="text-center">
                {branches[k].data.approved_claims.k_kalinga}
              </td>
              <td className="text-center">
                {branches[k].data.approved_claims.calamity_assistance}
              </td>
              <td className="text-center">
                {branches[k].data.approved_claims.kjsp}
              </td>
              <td className="text-center">
                {branches[k].data.claims_counts_as_of}
              </td>
            </tr>
          );
        }
      }
    }

    rows.push(
      <tr style={{backgroundColor: "#696", color: "#fff"}}>
        <td>
          <strong>
            Grand Total
          </strong>
        </td>
        <td className="text-center">
          <strong>
            {tBlip}
          </strong>
        </td>
        <td className="text-center">
          <strong>
            {tClip}
          </strong>
        </td>
        <td className="text-center">
          <strong>
            {tHiip}
          </strong>
        </td>
        <td className="text-center">
          <strong>
            {tKbente}
          </strong>
        </td>
        <td className="text-center">
          <strong>
            {tKkalinga}
          </strong>
        </td>
        <td className="text-center">
          <strong>
            {tCalamityAssistance}
          </strong>
        </td>
        <td className="text-center">
          <strong>
            {tKjsp}
          </strong>
        </td>
        <td>
        </td>
      </tr>
    );

    rows.push(
      <tr style={{backgroundColor: "#000", color: "#fff"}}>
        <td>
          <strong>
            Grand Total Amount
          </strong>
        </td>
        <td className="text-center">
          <strong>
            {numberWithCommas(tTotalBLip)}
          </strong>
        </td>
        <td className="text-center">
          <strong>
            {numberWithCommas(tTotalClip)}
          </strong>
        </td>
        <td className="text-center">
          <strong>
            {numberWithCommas(tTotalHiip)}
          </strong>
        </td>
        <td className="text-center">
          <strong>
            {numberWithCommas(tTotalKbente)}
          </strong>
        </td>
        <td className="text-center">
          <strong>
            {numberWithCommas(tTotalKkalinga)}
          </strong>
        </td>
        <td className="text-center">
          <strong>
            {numberWithCommas(tTotalCalamityAssistance)}
          </strong>
        </td>
        <td className="text-center">
          <strong>
            {numberWithCommas(tTotalKjsp)}
          </strong>
        </td>
        <td>
        </td>
      </tr>
    );

    return (
      <table className="table table-sm table-bordered">
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }

  renderOverviewTableClaimsSummary() {
    var areas   = this.state.data.areas;
    var rows    = [];
    var colSpan = 13;

    var areaColor     = "#bad5fd";
    var clusterColor  = "#c5ffc1";
    var branchColor   = "#797979";

    var tTotalBLip                = 0.00;
    var tTotalClip                = 0.00;
    var tTotalHiip                = 0.00;
    var tTotalKbente              = 0.00;
    var tTotalKkalinga            = 0.00;
    var tTotalKjsp                = 0.00;
    var tTotalCalamityAssistance  = 0.00;
    var tBlip                     = 0;
    var tClip                     = 0;
    var tHiip                     = 0;
    var tKbente                   = 0;
    var tKkalinga                 = 0;
    var tKjsp                     = 0;
    var tCalamityAssistance       = 0;

    var tTotalKcoopBlipAmount     = 0.00;
    var tTotalKcoopBlip           = 0;
    var tTotalCapsrBlipAmount     = 0.00;
    var tTotalCapsrBlip           = 0;
    var tTotalAssociateBlipAmount = 0.00;
    var tTotalAssociateBlip       = 0;
    var tTotalJvoBlipAmount       = 0.00;
    var tTotalJvoBlip             = 0;

    var tTotalKcoopClipAmount     = 0.00;
    var tTotalKcoopClip           = 0;
    var tTotalCapsrClipAmount     = 0.00;
    var tTotalCapsrClip           = 0;
    var tTotalAssociateClipAmount = 0.00;
    var tTotalAssociateClip       = 0;
    var tTotalJvoClipAmount       = 0.00;
    var tTotalJvoClip             = 0;

    var tTotalKcoopHiipAmount     = 0.00;
    var tTotalKcoopHiip           = 0;
    var tTotalCapsrHiipAmount     = 0.00;
    var tTotalCapsrHiip           = 0;
    var tTotalAssociateHiipAmount = 0.00;
    var tTotalAssociateHiip       = 0;
    var tTotalJvoHiipAmount       = 0.00;
    var tTotalJvoHiip             = 0;

    var tTotalKcoopKbenteAmount     = 0.00;
    var tTotalKcoopKbente           = 0;
    var tTotalCapsrKbenteAmount     = 0.00;
    var tTotalCapsrKbente           = 0;
    var tTotalAssociateKbenteAmount = 0.00;
    var tTotalAssociateKbente       = 0;
    var tTotalJvoKbenteAmount       = 0.00;
    var tTotalJvoKbente             = 0;

    var tTotalKcoopKkalingaAmount     = 0.00;
    var tTotalKcoopKkalinga           = 0;
    var tTotalCapsrKkalingaAmount     = 0.00;
    var tTotalCapsrKkalinga           = 0;
    var tTotalAssociateKkalingaAmount = 0.00;
    var tTotalAssociateKkalinga       = 0;
    var tTotalJvoKkalingaAmount       = 0.00;
    var tTotalJvoKkalinga             = 0;

    var tTotalKcoopKjspAmount     = 0.00;
    var tTotalKcoopKjsp           = 0;
    var tTotalCapsrKjspAmount     = 0.00;
    var tTotalCapsrKjsp           = 0;
    var tTotalAssociateKjspAmount = 0.00;
    var tTotalAssociateKjsp       = 0;
    var tTotalJvoKjspAmount       = 0.00;
    var tTotalJvoKjsp             = 0;

    var tTotalKcoopCalamityAssistanceAmount     = 0.00;
    var tTotalKcoopCalamityAssistance           = 0;
    var tTotalCapsrCalamityAssistanceAmount     = 0.00;
    var tTotalCapsrCalamityAssistance           = 0;
    var tTotalAssociateCalamityAssistanceAmount = 0.00;
    var tTotalAssociateCalamityAssistance       = 0;
    var tTotalJvoCalamityAssistanceAmount       = 0.00;
    var tTotalJvoCalamityAssistance             = 0;

    var tTotalKcoopClaimsAmount       = 0.00;
    var tTotalKcoopClaims             = 0;
    var tTotalCapsrClaimsAmount       = 0.00;
    var tTotalCapsrClaims             = 0;
    var tTotalAssociateClaimsAmount   = 0.00;
    var tTotalAssociateClaims         = 0;
    var tTotalJvoClaimsAmount         = 0.00;
    var tTotalJvoClaims               = 0;

    var tTotalClaims                  = 0;
    var tTotalClaimsAmount            = 0.00;

    rows.push(
      <tr style={{backgroundColor: areaColor}}>
        <th className="text-center" colSpan={colSpan}>
          <h4>        
            CLAIMS SUMMARY
          </h4>  
        </th>
      </tr>
    );

    rows.push(
      <tr style={{backgroundColor: branchColor, color: "white"}}>
        <th>
        </th>
        <th className="text-center" colSpan="2">
          KCOOP
        </th>
        <th className="text-center" colSpan="2">
          CAPS-R
        </th>
        <th className="text-center" colSpan="2">
          ASSOCIATE
        </th>
        <th className="text-center" colSpan="2">
          JVOMFI
        </th>
        <th className="text-center" colSpan="2">
          TOTAL
        </th>
      </tr>
    );

    rows.push(
      <tr style={{backgroundColor: branchColor, color: "white"}}>
        <th>
        </th>
        <th className="text-center">
          NUMBER
        </th>
        <th className="text-center">
          AMOUNT
        </th>
        <th className="text-center">
          NUMBER
        </th>
        <th className="text-center">
          AMOUNT
        </th>
        <th className="text-center">
          NUMBER
        </th>
        <th className="text-center">
          AMOUNT
        </th>
        <th className="text-center">
          NUMBER
        </th>
        <th className="text-center">
          AMOUNT
        </th>
        <th className="text-center">
          NUMBER
        </th>
        <th className="text-center">
          AMOUNT
        </th>
      </tr> 
    );

    for(var i = 0; i < areas.length; i++) {
     
      var clusters    = areas[i].clusters;

      for(var j = 0; j < clusters.length; j++) {

        var branches  = clusters[j].branches;

        for(var k = 0; k < branches.length; k++) {
        

          tTotalBLip                += branches[k].data.total_blip_claims;
          tTotalClip                += branches[k].data.total_clip_claims;
          tTotalHiip                += branches[k].data.total_hiip_claims;
          tTotalKbente              += branches[k].data.total_kbente_claims;
          tTotalKkalinga            += branches[k].data.total_kkalinga_claims;
          tTotalKjsp                += branches[k].data.total_kjsp_claims;
          tTotalCalamityAssistance  += branches[k].data.total_calamity_assistance_claims;
          tBlip                     += branches[k].data.approved_claims.blip;
          tClip                     += branches[k].data.approved_claims.clip;
          tHiip                     += branches[k].data.approved_claims.hiip;
          tKbente                   += branches[k].data.approved_claims.k_bente;
          tKkalinga                 += branches[k].data.approved_claims.k_kalinga;
          tKjsp                     += branches[k].data.approved_claims.kjsp;
          tCalamityAssistance       += branches[k].data.approved_claims.calamity_assistance;

          tTotalKcoopBlip           += branches[k].data.total_blip_kcoop;
          tTotalKcoopBlipAmount     += branches[k].data.total_blip_kcoop_amount;
          tTotalCapsrBlip           += branches[k].data.total_blip_capsr;
          tTotalCapsrBlipAmount     += branches[k].data.total_blip_capsr_amount;
          tTotalAssociateBlip       += branches[k].data.total_blip_associate;
          tTotalAssociateBlipAmount += branches[k].data.total_blip_associate_amount;
          tTotalJvoBlip             += branches[k].data.total_blip_jvo;
          tTotalJvoBlipAmount       += branches[k].data.total_blip_jvo_amount;

          tTotalKcoopClip           += branches[k].data.total_clip_kcoop;
          tTotalKcoopClipAmount     += branches[k].data.total_clip_kcoop_amount;
          tTotalCapsrClip           += branches[k].data.total_clip_capsr;
          tTotalCapsrClipAmount     += branches[k].data.total_clip_capsr_amount;
          tTotalAssociateClip       += branches[k].data.total_clip_associate;
          tTotalAssociateClipAmount += branches[k].data.total_clip_associate_amount;
          tTotalJvoClip             += branches[k].data.total_clip_jvo;
          tTotalJvoClipAmount       += branches[k].data.total_clip_jvo_amount;

          tTotalKcoopHiip           += branches[k].data.total_hiip_kcoop;
          tTotalKcoopHiipAmount     += branches[k].data.total_hiip_kcoop_amount;
          tTotalCapsrHiip           += branches[k].data.total_hiip_capsr;
          tTotalCapsrHiipAmount     += branches[k].data.total_hiip_capsr_amount;
          tTotalAssociateHiip       += branches[k].data.total_hiip_associate;
          tTotalAssociateHiipAmount += branches[k].data.total_hiip_associate_amount;
          tTotalJvoHiip             += branches[k].data.total_hiip_jvo;
          tTotalJvoHiipAmount       += branches[k].data.total_hiip_jvo_amount;

          tTotalKcoopKbente           += branches[k].data.total_kbente_kcoop;
          tTotalKcoopKbenteAmount     += branches[k].data.total_kbente_kcoop_amount;
          tTotalCapsrKbente           += branches[k].data.total_kbente_capsr;
          tTotalCapsrKbenteAmount     += branches[k].data.total_kbente_capsr_amount;
          tTotalAssociateKbente       += branches[k].data.total_kbente_associate;
          tTotalAssociateKbenteAmount += branches[k].data.total_kbente_associate_amount;
          tTotalJvoKbente             += branches[k].data.total_kbente_jvo;
          tTotalJvoKbenteAmount       += branches[k].data.total_kbente_jvo_amount;

          tTotalKcoopKjsp           += branches[k].data.total_kjsp_kcoop;
          tTotalKcoopKjspAmount     += branches[k].data.total_kjsp_kcoop_amount;
          tTotalCapsrKjsp           += branches[k].data.total_kjsp_capsr;
          tTotalCapsrKjspAmount     += branches[k].data.total_kjsp_capsr_amount;
          tTotalAssociateKjsp       += branches[k].data.total_kjsp_associate;
          tTotalAssociateKjspAmount += branches[k].data.total_kjsp_associate_amount;
          tTotalJvoKjsp             += branches[k].data.total_kjsp_jvo;
          tTotalJvoKjspAmount       += branches[k].data.total_kjsp_jvo_amount;

          tTotalKcoopKkalinga           += branches[k].data.total_kkalinga_kcoop;
          tTotalKcoopKkalingaAmount     += branches[k].data.total_kkalinga_kcoop_amount;
          tTotalCapsrKkalinga           += branches[k].data.total_kkalinga_capsr;
          tTotalCapsrKkalingaAmount     += branches[k].data.total_kkalinga_capsr_amount;
          tTotalAssociateKkalinga       += branches[k].data.total_kkalinga_associate;
          tTotalAssociateKkalingaAmount += branches[k].data.total_kkalinga_associate_amount;
          tTotalJvoKkalinga             += branches[k].data.total_kkalinga_jvo;
          tTotalJvoKkalingaAmount       += branches[k].data.total_kkalinga_jvo_amount;

          tTotalKcoopCalamityAssistance           += branches[k].data.total_calamity_assistance_kcoop;
          tTotalKcoopCalamityAssistanceAmount     += branches[k].data.total_calamity_assistance_kcoop_amount;
          tTotalCapsrCalamityAssistance           += branches[k].data.total_calamity_assistance_capsr;
          tTotalCapsrCalamityAssistanceAmount     += branches[k].data.total_calamity_assistance_capsr_amount;
          tTotalAssociateCalamityAssistance       += branches[k].data.total_calamity_assistance_associate;
          tTotalAssociateCalamityAssistanceAmount += branches[k].data.total_calamity_assistance_associate_amount;
          tTotalJvoCalamityAssistance             += branches[k].data.total_calamity_assistance_jvo;
          tTotalJvoCalamityAssistanceAmount       += branches[k].data.total_calamity_assistance_jvo_amount;

        }
      }

      tTotalKcoopClaims       = tTotalKcoopBlip + tTotalKcoopClip + tTotalKcoopHiip + tTotalKcoopKbente + tTotalKcoopKjsp + tTotalKcoopKkalinga + tTotalKcoopCalamityAssistance
      tTotalKcoopClaimsAmount = tTotalKcoopBlipAmount + tTotalKcoopClipAmount + tTotalKcoopHiipAmount + tTotalKcoopKbenteAmount + tTotalKcoopKjspAmount + tTotalKcoopKkalingaAmount + tTotalKcoopCalamityAssistanceAmount
      tTotalCapsrClaims       = tTotalCapsrBlip + tTotalCapsrClip + tTotalCapsrHiip + tTotalCapsrKbente + tTotalCapsrKjsp + tTotalCapsrKkalinga + tTotalCapsrCalamityAssistance
      tTotalCapsrClaimsAmount = tTotalCapsrBlipAmount + tTotalCapsrClipAmount + tTotalCapsrHiipAmount + tTotalCapsrKbenteAmount + tTotalCapsrKjspAmount + tTotalCapsrKkalingaAmount + tTotalCapsrCalamityAssistanceAmount
      tTotalAssociateClaims       = tTotalAssociateBlip + tTotalAssociateClip + tTotalAssociateHiip + tTotalAssociateKbente + tTotalAssociateKjsp + tTotalAssociateKkalinga + tTotalAssociateCalamityAssistance
      tTotalAssociateClaimsAmount = tTotalAssociateBlipAmount + tTotalAssociateClipAmount + tTotalAssociateHiipAmount + tTotalAssociateKbenteAmount + tTotalAssociateKjspAmount + tTotalAssociateKkalingaAmount + tTotalAssociateCalamityAssistanceAmount
      tTotalJvoClaims       = tTotalJvoBlip + tTotalJvoClip + tTotalJvoHiip + tTotalJvoKbente + tTotalJvoKjsp + tTotalJvoKkalinga + tTotalJvoCalamityAssistance
      tTotalJvoClaimsAmount = tTotalJvoBlipAmount + tTotalJvoClipAmount + tTotalJvoHiipAmount + tTotalJvoKbenteAmount + tTotalJvoKjspAmount + tTotalJvoKkalingaAmount + tTotalJvoCalamityAssistanceAmount
    
      tTotalClaims       = tBlip + tClip + tHiip + tKbente + tKjsp + tKkalinga + tCalamityAssistance
      tTotalClaimsAmount = tTotalBLip + tTotalClip + tTotalHiip + tTotalKbente + tTotalKjsp + tTotalKkalinga + tTotalCalamityAssistance
    }

    rows.push(
      <tr>
        <td>
          <strong>
            <a href={"blip_summary"} target='_blank'>  
              BLIP
            </a>
          </strong>
        </td>
        <td className="text-center">
          {tTotalKcoopBlip}
        </td>
        <td className="text-center">
          {numberWithCommas(tTotalKcoopBlipAmount)}
        </td>
        <td className="text-center">
          {tTotalCapsrBlip}
        </td>
        <td className="text-center">
          {numberWithCommas(tTotalCapsrBlipAmount)}
        </td>
        <td className="text-center">
          {tTotalAssociateBlip}
        </td>
        <td className="text-center">
          {numberWithCommas(tTotalAssociateBlipAmount)}
        </td>
        <td className="text-center">
          {tTotalJvoBlip}
        </td>
        <td className="text-center">
          {numberWithCommas(tTotalJvoBlipAmount)}
        </td>
        <td className="text-center">
          {tBlip}
        </td>
        <td className="text-center">
          {numberWithCommas(tTotalBLip)}
        </td>
      </tr>
    );

    rows.push(
      <tr>
        <td>
          <strong>
            CLIP
          </strong>
        </td>
        <td className="text-center">
          {tTotalKcoopClip}
        </td>
        <td className="text-center">
          {numberWithCommas(tTotalKcoopClipAmount)}
        </td>
        <td className="text-center">
          {tTotalCapsrClip}
        </td>
        <td className="text-center">
          {numberWithCommas(tTotalCapsrClipAmount)}
        </td>
        <td className="text-center">
          {tTotalAssociateClip}
        </td>
        <td className="text-center">
          {numberWithCommas(tTotalAssociateClipAmount)}
        </td>
        <td className="text-center">
          {tTotalJvoClip}
        </td>
        <td className="text-center">
          {numberWithCommas(tTotalJvoClipAmount)}
        </td>
        <td className="text-center">
          {tClip}
        </td>
        <td className="text-center">
          {numberWithCommas(tTotalClip)}
        </td>
      </tr>
    );

    rows.push(
      <tr>
        <td>
          <strong>
            HIIP
          </strong>
        </td>
        <td className="text-center">
          {tTotalKcoopHiip}
        </td>
        <td className="text-center">
          {numberWithCommas(tTotalKcoopHiipAmount)}
        </td>
        <td className="text-center">
          {tTotalCapsrHiip}
        </td>
        <td className="text-center">
          {numberWithCommas(tTotalCapsrHiipAmount)}
        </td>
        <td className="text-center">
          {tTotalAssociateHiip}
        </td>
        <td className="text-center">
          {numberWithCommas(tTotalAssociateHiipAmount)}
        </td>
        <td className="text-center">
          {tTotalJvoHiip}
        </td>
        <td className="text-center">
          {numberWithCommas(tTotalJvoHiipAmount)}
        </td>
        <td className="text-center">
          {tHiip}
        </td>
        <td className="text-center">
          {numberWithCommas(tTotalHiip)}
        </td>
      </tr>
    );

    rows.push(
      <tr>
        <td>
          <strong>
            K-BENTE
          </strong>
        </td>
        <td className="text-center">
          {tTotalKcoopKbente}
        </td>
        <td className="text-center">
          {numberWithCommas(tTotalKcoopKbenteAmount)}
        </td>
        <td className="text-center">
          {tTotalCapsrKbente}
        </td>
        <td className="text-center">
          {numberWithCommas(tTotalCapsrKbenteAmount)}
        </td>
        <td className="text-center">
          {tTotalAssociateKbente}
        </td>
        <td className="text-center">
          {numberWithCommas(tTotalAssociateKbenteAmount)}
        </td>
        <td className="text-center">
          {tTotalJvoKbente}
        </td>
        <td className="text-center">
          {numberWithCommas(tTotalJvoKbenteAmount)}
        </td>
        <td className="text-center">
          {tKbente}
        </td>
        <td className="text-center">
          {numberWithCommas(tTotalKbente)}
        </td>
      </tr>
    );

    rows.push(
      <tr>
        <td>
          <strong>
            K-KALINGA
          </strong>
        </td>
        <td className="text-center">
          {tTotalKcoopKkalinga}
        </td>
        <td className="text-center">
          {numberWithCommas(tTotalKcoopKkalingaAmount)}
        </td>
        <td className="text-center">
          {tTotalCapsrKkalinga}
        </td>
        <td className="text-center">
          {numberWithCommas(tTotalCapsrKkalingaAmount)}
        </td>
        <td className="text-center">
          {tTotalAssociateKkalinga}
        </td>
        <td className="text-center">
          {numberWithCommas(tTotalAssociateKkalingaAmount)}
        </td>
        <td className="text-center">
          {tTotalJvoKkalinga}
        </td>
        <td className="text-center">
          {numberWithCommas(tTotalJvoKkalingaAmount)}
        </td>
        <td className="text-center">
          {tKkalinga}
        </td>
        <td className="text-center">
          {numberWithCommas(tTotalKkalinga)}
        </td>
      </tr>
    );

    rows.push(
      <tr>
        <td>
          <strong>
            CALAMITY ASSISTANCE
          </strong>
        </td>
        <td className="text-center">
          {tTotalKcoopCalamityAssistance}
        </td>
        <td className="text-center">
          {numberWithCommas(tTotalKcoopCalamityAssistanceAmount)}
        </td>
        <td className="text-center">
          {tTotalCapsrCalamityAssistance}
        </td>
        <td className="text-center">
          {numberWithCommas(tTotalCapsrCalamityAssistanceAmount)}
        </td>
        <td className="text-center">
          {tTotalAssociateCalamityAssistance}
        </td>
        <td className="text-center">
          {numberWithCommas(tTotalAssociateCalamityAssistanceAmount)}
        </td>
        <td className="text-center">
          {tTotalJvoCalamityAssistance}
        </td>
        <td className="text-center">
          {numberWithCommas(tTotalJvoCalamityAssistanceAmount)}
        </td>
        <td className="text-center">
          {tCalamityAssistance}
        </td>
        <td className="text-center">
          {numberWithCommas(tTotalCalamityAssistance)}
        </td>
      </tr>
    );

    rows.push(
      <tr>
        <td>
          <strong>
            KJSP
          </strong>
        </td>
        <td className="text-center">
          {tTotalKcoopKjsp}
        </td>
        <td className="text-center">
          {numberWithCommas(tTotalKcoopKjspAmount)}
        </td>
        <td className="text-center">
          {tTotalCapsrKjsp}
        </td>
        <td className="text-center">
          {numberWithCommas(tTotalCapsrKjspAmount)}
        </td>
        <td className="text-center">
          {tTotalAssociateKjsp}
        </td>
        <td className="text-center">
          {numberWithCommas(tTotalAssociateKjspAmount)}
        </td>
        <td className="text-center">
          {tTotalJvoKjsp}
        </td>
        <td className="text-center">
          {numberWithCommas(tTotalJvoKjspAmount)}
        </td>
        <td className="text-center">
          {tKjsp}
        </td>
        <td className="text-center">
          {numberWithCommas(tTotalKjsp)}
        </td>
      </tr>
    );

    rows.push(
      <tr style={{backgroundColor: "#000", color: "#fff"}}>
        <td>
          <strong>
            Grand Total
          </strong>
        </td>
        <td className="text-center">
          <strong>
            {tTotalKcoopClaims}
          </strong>
        </td>
        <td className="text-center">
          <strong>
            {numberWithCommas(tTotalKcoopClaimsAmount)}
          </strong>
        </td>
        <td className="text-center">
          <strong>
            {tTotalCapsrClaims}
          </strong>
        </td>
        <td className="text-center">
          <strong>
            {numberWithCommas(tTotalCapsrClaimsAmount)}
          </strong>
        </td>
        <td className="text-center">
          <strong>
            {tTotalAssociateClaims}
          </strong>
        </td>
        <td className="text-center">
          <strong>
            {numberWithCommas(tTotalAssociateClaimsAmount)}
          </strong>
        </td>
        <td className="text-center">
          <strong>
            {tTotalJvoClaims}
          </strong>
        </td>
        <td className="text-center">
          <strong>
            {numberWithCommas(tTotalJvoClaimsAmount)}
          </strong>
        </td>
        <td className="text-center">
          <strong>
            {tTotalClaims}
          </strong>
        </td>
        <td className="text-center">
          <strong>
            {numberWithCommas(tTotalClaimsAmount)}
          </strong>
        </td>
      </tr>
    );

    return (
      <table className="table table-sm table-bordered">
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }

  renderOverviewTableUploadedDocuments(){
    var areas   = this.state.data.areas;
    var rows    = [];
    var colSpan = 13;

    var areaColor     = "#bad5fd";
    var clusterColor  = "#c5ffc1";
    var branchColor   = "#797979";

    var tTotalNumberOfAttachFiles                     = 0.00;
    var tTotalNumberOfActiveMembers                   = 0.00;
    var tTotalPercentage                              = 0.00;
    var tUploadDocummentsCountasOf                    = 0.00;

    var kmbaAssociateTotalUploadDocuments             = 0;
    var kmbaAssociateTotalNumberOfActiveMembers       = 0;
    var kmbaAssociateTotalPercentage                  = 0;
    var kmbaAssociateTotalDocummentsCountasOf         = 0;

    var kcoopTotalUploadDocuments                     = 0;
    var kcoopTotalNumberOfActiveMembers               = 0;
    var kcoopTotalPercentage                          = 0;
    var kcoopTotalDocummentsCountasOf                 = 0;
   
    rows.push(
      <tr style={{backgroundColor: areaColor}}>
        <th className="text-center" colSpan={colSpan}>
          <h4>        
            UPLOADED DOCUMENTS FOR ASSOCIATE AND KCOOP SUMMARY
          </h4>  
        </th>
      </tr>
    );

    rows.push(
      <tr style={{backgroundColor: branchColor, color: "white"}}>
        <th>
          Area Name
        </th>
        <th className="text-center">
          UPLOADED DOCUMENTS
        </th>
        <th className="text-center">
          ACTIVE MEMBERS
        </th>
        <th className="text-center">
          UPLOADED PERCENTAGE
        </th>
        <th className="text-center">
          NOT UPLOADED PERCENTAGE
        </th>
        <th className="text-center">
          As Of (Uploaded Documents Counts)
        </th>
      </tr>
    );

    for(var i = 0; i < areas.length; i++) {
      
      var clusters    = areas[i].clusters;

      var aTotalNumberOfAttachFiles        = 0.00;
      var aTotalNumberOfActiveMembers      = 0.00;
      var aTotalPercentage                 = 0.00;
      var aUploadDocummentsCountasOf       = 0.00;
      
      for(var j = 0; j < clusters.length; j++) {
        var branches  = clusters[j].branches;

        var cTotalNumberOfAttachFiles    = 0.00;
        var cTotalNumberOfActiveMembers  = 0.00;
        var cTotalPercentage             = 0.00;
        var cUploadDocummentsCountasOf   = 0.00;

        for(var k = 0; k < branches.length; k++) {
          if(k == 0) {
            
          }

          cTotalNumberOfAttachFiles         += branches[k].data.number_of_attached_files;
          cTotalNumberOfActiveMembers       += branches[k].data.number_of_active_members;
          cUploadDocummentsCountasOf         = branches[k].data.uploaded_documents_counts_as_of;

          aTotalNumberOfAttachFiles         += branches[k].data.number_of_attached_files;
          aTotalNumberOfActiveMembers       += branches[k].data.number_of_active_members;
          aUploadDocummentsCountasOf         = branches[k].data.uploaded_documents_counts_as_of;

          if (i < 3) {
            kmbaAssociateTotalUploadDocuments           += branches[k].data.number_of_attached_files;
            kmbaAssociateTotalNumberOfActiveMembers     += branches[k].data.number_of_active_members;
            kmbaAssociateTotalDocummentsCountasOf        = branches[k].data.uploaded_documents_counts_as_of;
            var areaName = "KMBA Associate";
          } else {
            kcoopTotalUploadDocuments                   += branches[k].data.number_of_attached_files;
            kcoopTotalNumberOfActiveMembers             += branches[k].data.number_of_active_members;
            kcoopTotalDocummentsCountasOf                = branches[k].data.uploaded_documents_counts_as_of;
            var areaName = "KCOOP";
          }

          tTotalNumberOfAttachFiles         += branches[k].data.number_of_attached_files;
          tTotalNumberOfActiveMembers       += branches[k].data.number_of_active_members;
          tUploadDocummentsCountasOf         = branches[k].data.uploaded_documents_counts_as_of;
        }
      }

      rows.push(
        <tr key={"area-total-" + areas[i].id}>
          <th>
           {areas[i].name}
          </th>
          <td className="text-center">
            {aTotalNumberOfAttachFiles}
          </td>
          <td className="text-center">
            {aTotalNumberOfActiveMembers}
          </td>
          <td className="text-center">
            {Math.round((aTotalNumberOfAttachFiles / aTotalNumberOfActiveMembers) * 100)}%
          </td>
          <td className="text-center">
            {Math.round((((aTotalNumberOfAttachFiles / aTotalNumberOfActiveMembers) * 100) - 100) * -1)}%
          </td>
          <td className="text-center">
            {aUploadDocummentsCountasOf}
          </td>
        </tr>
      );
    }

    rows.push(
      <tr key={"subtotal-kmba-associate"}>
        <th>
          KMBA Associate Sub Total 
        </th>
        <th className="text-center">
          {kmbaAssociateTotalUploadDocuments}
        </th>
        <th className="text-center">
          {kmbaAssociateTotalNumberOfActiveMembers}
        </th>
        <th className="text-center">
          {Math.round((kmbaAssociateTotalUploadDocuments / kmbaAssociateTotalNumberOfActiveMembers) *100)}%
        </th>
        <th className="text-center">
          {Math.round((((kmbaAssociateTotalUploadDocuments / kmbaAssociateTotalNumberOfActiveMembers) *100) - 100) * -1)}%
        </th>
        <td className="text-center">
          {kmbaAssociateTotalDocummentsCountasOf} 
        </td>
      </tr>
    );

    rows.push(
      <tr key={"subtotal-kcoop"}>
        <th>
          KCOOP Sub Total 
        </th>
        <th className="text-center">
          {kcoopTotalUploadDocuments}
        </th>
        <th className="text-center">
          {kcoopTotalNumberOfActiveMembers}
        </th>
        <th className="text-center">
           {Math.round((kcoopTotalUploadDocuments / kcoopTotalNumberOfActiveMembers) * 100)}%
        </th>
        <th className="text-center">
           {Math.round((((kcoopTotalUploadDocuments / kcoopTotalNumberOfActiveMembers) * 100) - 100) * -1)}%
        </th>
        <td className="text-center">
          {kcoopTotalDocummentsCountasOf} 
        </td>
      </tr>
    );

    rows.push(
      <tr key={"grand-total"} style={{backgroundColor: "#000", color: "#fff"}}>
        <td>
          <strong>
            Grand Total
          </strong>
        </td>
        <td className="text-center">
          <strong>
            {tTotalNumberOfAttachFiles}
          </strong>
        </td>
        <td className="text-center">
          <strong>
            {tTotalNumberOfActiveMembers}
          </strong>
        </td>
        <td className="text-center">
          <strong>
            {Math.round((tTotalNumberOfAttachFiles / tTotalNumberOfActiveMembers) * 100)}%
          </strong>
        </td>
        <td className="text-center">
          <strong>
            {Math.round((((tTotalNumberOfAttachFiles / tTotalNumberOfActiveMembers) * 100) - 100) * -1)}%
          </strong>
        </td>
        <td className="text-center">
          {tUploadDocummentsCountasOf}
        </td>
      </tr>
    );

    return (
      <table className="table table-sm table-bordered">
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }

  renderOverviewTableUploadedDocumentsCounts() {
    var areas   = this.state.data.areas;
    var rows    = [];
    var colSpan = 13;

    var areaColor     = "#bad5fd";
    var clusterColor  = "#c5ffc1";
    var branchColor   = "#797979";

    var tTotalUploadedFIle                = 0.00;
    var tTotalActiveMember                = 0.00;
    var tTotalPercentage                  = 0.00;

    var tUploadedFile                     = 0;
    var tActiveMember                     = 0;
    var tPercentage                       = 0;
   
    rows.push(
      <tr style={{backgroundColor: areaColor}}>
        <th className="text-center" colSpan={colSpan}>
          <h4>        
            UPLOADED DOCUMENTS COUNTS PER BRANCH
          </h4>  
        </th>
      </tr>
    );

    rows.push(
      <tr style={{backgroundColor: branchColor, color: "white"}}>
        <th>
          Branch Name
        </th>
        <th className="text-center">
          UPLOADED DOCUMENTS
        </th>
        <th className="text-center">
          ACTIVE MEMBERS
        </th>
        <th className="text-center">
          UPLOADED PERCENTAGE
        </th>
        <th className="text-center">
          NOT UPLOADED PERCENTAGE
        </th>
        <th>
          As Of (Uploaded Documents Counts)
        </th>
      </tr>
    );

    for(var i = 0; i < areas.length; i++) {
     
      var clusters    = areas[i].clusters;

      for(var j = 0; j < clusters.length; j++) {

        var branches  = clusters[j].branches;

        for(var k = 0; k < branches.length; k++) {
    
          tTotalUploadedFIle                += branches[k].data.total_uploaded_documents_counts;
          tTotalActiveMember                += branches[k].data.total_active_members;
          tTotalPercentage                  += branches[k].data.total_percentage;
          tUploadedFile                     += branches[k].data.number_of_attached_files;
          tActiveMember                     += branches[k].data.number_of_active_members;
          tPercentage                       += branches[k].data.percentage;
          

          rows.push(
            <tr key={"branch-" + branches[k].id}>
              <td>
                <strong>
                  {branches[k].name}
                </strong>
              </td>
              <td className="text-center">
                {branches[k].data.number_of_attached_files}
              </td>
              <td className="text-center">
                {branches[k].data.number_of_active_members}
              </td>
              <td className="text-center">
                {branches[k].data.percentage}%
              </td>
              <td className="text-center">
                {(branches[k].data.percentage - 100) * -1}%
              </td>
              <td className="text-center">
                {branches[k].data.uploaded_documents_counts_as_of}
              </td>
            </tr>
          );
        }
      }
    }

    rows.push(
      <tr style={{backgroundColor: "#696", color: "#fff"}}>
        <td>
          <strong>
            Grand Total
          </strong>
        </td>
        <td className="text-center">
          <strong>
            {tUploadedFile}
          </strong>
        </td>
        <td className="text-center">
          <strong>
            {tActiveMember}
          </strong>
        </td>
        <td className="text-center">
          <strong>
            {tTotalPercentage = tUploadedFile * 100 / tActiveMember}
          </strong>
        </td>
        <td className="text-center">
          <strong>
            {(((tTotalPercentage = tUploadedFile * 100 / tActiveMember) - 100) * -1)}
          </strong>
        </td>
        <td>
        </td>
      </tr>
    );

    return (
      <table className="table table-sm table-bordered">
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }

  render() {
    if(this.state.isLoading) {
      return (
        <div>
          <SkCubeLoading/>
          <center>
            <h6>
              Loading Overview...
            </h6>
          </center>
        </div>
      );
    } else {
      return (
        <div>
          <h4>
            Overview
          </h4>
          <div className="row">
            <div className="col-md-10 col-xs-12">
              <div className="form-group">
                <input
                  type="date"
                  className="form-control"
                  disabled={this.state.isFetching}
                  value={this.state.asOf}
                  onChange={this.handleAsOfChanged.bind(this)}
                />
              </div>
            </div>
            <div className="col-md-2 col-xs-12">
              <div className="form-group">
                <button 
                  className="btn btn-info btn-block"
                  disabled={this.state.isFetching}
                  onClick={this.handleSyncClicked.bind(this)}
                >
                  <span className="fa fa-sync"/>
                  Sync
                </button>
              </div>
            </div>
          </div>
          {this.renderOverviewTable()}
          <br />
          {this.renderOverviewTableSummary()}
          <br />
          {this.renderOverviewTableClaimsSummary()}
          <br />
          {this.renderOverviewTableClaims()}
          <br />
          {this.renderOverviewTableUploadedDocuments()}
          <br />
          {this.renderOverviewTableUploadedDocumentsCounts()}
        </div>
      );
    }
  }
}