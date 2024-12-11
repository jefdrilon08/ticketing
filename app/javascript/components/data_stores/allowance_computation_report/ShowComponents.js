import React from 'react';
import $ from 'jquery';
import moment from 'moment';
import Select from 'react-select';
import Toggle from 'react-toggle';
import "react-toggle/style.css";

import SkCubeLoading from '../../SkCubeLoading';
import ErrorDisplay from '../../ErrorDisplay';
import {numberWithCommas} from '../../utils/helpers';

export default class ShowComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state  = {
      isLoading: true,
      data: false,
      errors: false
    };
  }

  componentDidMount() {
    var context = this;
   
    $.ajax({
      url: "/api/v1/data_stores/allowance_computation_report/fetch",
      data: {
        id: context.props.id
      },

      method: 'GET',

      success: function(response) {
        console.log(response);
        context.setState({
	   isLoading: false,
           data: response.data
        });    
      },
      error: function(response) {
        console.log(response);
        alert("Something went wrong when fetching data store");
      }
    });
  }


  renderErrorDisplay() {
    if(this.state.errors) {
      return  (
        <ErrorDisplay
          errors={this.state.errors}
        />
      );
    }
  } 

renderSatoData() {
    const sectorData = this.state.data.records;
    return sectorData.map((sector, sectorIndex) => {
        let sectorTotalParMonth = 0;
        let sectorTotalParYear = 0;
        let sectorTotalParGreaterYear = 0;
        let sectorTotalPrincipalBalance = 0;
     	let totalParSector = 0; 
	let portfolioLessParSector = 0;
        let sectorAllowCurrent	= 0;
        let sectorAllowMonth = 0;
	let sectorAllowYear = 0;
	let sectorAllowGreaterYear = 0;

        const sortedClusters = sector.cluster.sort((a, b) => a.cluster_name.localeCompare(b.cluster_name));
        const tdPortStyle = {
    		backgroundColor: '#d7ecff'
	 	};
	const tdAllowStyle = {
	    	backgroundColor: '#8bb4ff'
	};
        return (
            <React.Fragment key={sector.sector_id}>
                <tr>
                    <td colSpan='11' className="text-center"><strong>{sector.sector_name}</strong></td>
                </tr>
                {sortedClusters.map((cluster, clusterIndex) => {
                    let clusterTotalParMonth = 0;
                    let clusterTotalParYear = 0;
                    let clusterTotalParGreaterYear = 0;
                    let clusterTotalPrincipalBalance = 0;
		   
                    const sortedSato = cluster.sato.sort((a, b) => a.sato_name.localeCompare(b.sato_name));

                    sortedSato.forEach((sato) => {
                        clusterTotalParMonth += sato.par_month;
                        clusterTotalParYear += sato.par_year;
                        clusterTotalParGreaterYear += sato.par_greater_year;
                        clusterTotalPrincipalBalance += sato.principal_balance;
                    });
		
		    const totalParCluster = clusterTotalParMonth + clusterTotalParYear + clusterTotalParGreaterYear;
		    const portfolioLessParCluster = clusterTotalPrincipalBalance - totalParCluster;
		    const clusterAllowCurrent = portfolioLessParCluster * 0.01; 
                    const clusterAllowMonth = clusterTotalParMonth * 0.35;
		    const clusterAllowYear = clusterTotalParYear * 0.35;
                    const clusterAllowGreaterYear = clusterTotalParGreaterYear * 1;

                    sectorTotalParMonth += clusterTotalParMonth;
                    sectorTotalParYear += clusterTotalParYear;
                    sectorTotalParGreaterYear += clusterTotalParGreaterYear;
		    sectorTotalPrincipalBalance += clusterTotalPrincipalBalance;
                    
                    totalParSector += totalParCluster;
		    portfolioLessParSector += portfolioLessParCluster;
		    sectorAllowCurrent = portfolioLessParSector * 0.01;
		    sectorAllowMonth = sectorTotalParMonth * 0.35;
                    sectorAllowYear = sectorTotalParYear * 0.35;
		    sectorAllowGreaterYear = sectorTotalParGreaterYear * 1;

                    return (
                        <React.Fragment key={cluster.cluster_id}>
                            <tr>
                                <td colSpan='11' style={{ paddingLeft: '20px' }} className="text-center"><strong>{cluster.cluster_name}</strong></td>
			    </tr>
			    <tr>
			  	<td></td>
				<td className="text-center" colSpan='6' style={tdPortStyle}><strong>LOAN PORTFOLIO</strong></td>
				<td className="text-center" colSpan='4' style={tdAllowStyle}><strong>ALLOWANCE FOR IMPAIREMENT</strong></td>
			    </tr>
                            <tr>
                                <td><strong>SatO</strong></td>
                                <td style={tdPortStyle}><strong>Current</strong></td>
                                <td style={tdPortStyle}><strong>PAR (1 - 30 days)</strong></td>
                                <td style={tdPortStyle}><strong>PAR (31 - 365 days)</strong></td>
                                <td style={tdPortStyle}><strong>PAR (365 days above)</strong></td>
                                <td style={tdPortStyle}><strong>Total PAR</strong></td>
				<td style={tdPortStyle}><strong>Total</strong></td>
				<td style={tdAllowStyle}><strong>Current Amount (1%)</strong></td>
				<td style={tdAllowStyle}><strong>PAR 1 - 30 days (35%)</strong></td>
                                <td style={tdAllowStyle}><strong>PAR 31 - 365 days (35%)</strong></td>
                                <td style={tdAllowStyle}><strong>PAR 365 days above (100%)</strong></td>

                            </tr>
                            {sortedSato.map((sato, satoIndex) => {
				const totalParSato = sato.par_month + sato.par_year + sato.par_greater_year;
				const portfolioLessParSato = sato.principal_balance - totalParSato;
				const currentAllowAmount = portfolioLessParSato * 0.01;
				const allowParMonth = sato.par_month * 0.35;
				const allowParYear = sato.par_year * 0.35;
				const allowParGreaterYear = sato.par_greater_year * 1;
                                return (
                                    <tr key={sato.sato_id}>
					<td style={{ paddingLeft: '40px' }}><a href={`/data_stores/repayment_rates/${sato.rr_id}`} target='_blank'>{sato.sato_name.toUpperCase()}</a></td> 
					<td className="text-end" style={tdPortStyle}>{numberWithCommas(portfolioLessParSato)}</td>          
	                                <td className="text-end" style={tdPortStyle}>{numberWithCommas(sato.par_month)}</td>
					<td className="text-end" style={tdPortStyle}>{numberWithCommas(sato.par_year)}</td>
                                        <td className="text-end" style={tdPortStyle}>{numberWithCommas(sato.par_greater_year)}</td>
					<td className="text-end" style={tdPortStyle}>{numberWithCommas(totalParSato)}</td>
					<td className="text-end" style={tdPortStyle}>{numberWithCommas(sato.principal_balance)}</td>
					<td className="text-end" style={tdAllowStyle}>{numberWithCommas(currentAllowAmount)}</td>              
					<td className="text-end" style={tdAllowStyle}>{numberWithCommas(allowParMonth)}</td>      
					<td className="text-end" style={tdAllowStyle}>{numberWithCommas(allowParYear)}</td>      
					<td className="text-end" style={tdAllowStyle}>{numberWithCommas(allowParGreaterYear)}</td>      
                                    </tr>
                                );
                            })}
                            <tr>
				<td colSpan='1'><strong>Total {cluster.cluster_name}</strong></td>
				<td className="text-end" style={tdPortStyle}><strong>{numberWithCommas(portfolioLessParCluster)}</strong></td>
                                <td className="text-end" style={tdPortStyle}><strong>{numberWithCommas(clusterTotalParMonth)}</strong></td>
                                <td className="text-end" style={tdPortStyle}><strong>{numberWithCommas(clusterTotalParYear)}</strong></td>
                                <td className="text-end" style={tdPortStyle}><strong>{numberWithCommas(clusterTotalParGreaterYear)}</strong></td>
				<td className="text-end" style={tdPortStyle}><strong>{numberWithCommas(totalParCluster)}</strong></td>
                                <td className="text-end" style={tdPortStyle}><strong>{numberWithCommas(clusterTotalPrincipalBalance)}</strong></td>
				<td className="text-end" style={tdAllowStyle}><strong>{numberWithCommas(clusterAllowCurrent)}</strong></td>
				<td className="text-end" style={tdAllowStyle}><strong>{numberWithCommas(clusterAllowMonth)}</strong></td>
				<td className="text-end" style={tdAllowStyle}><strong>{numberWithCommas(clusterAllowYear)}</strong></td>
				<td className="text-end" style={tdAllowStyle}><strong>{numberWithCommas(clusterAllowGreaterYear)}</strong></td>
			    </tr>
                        </React.Fragment>
                    );
                })}
                <tr>
                    <td colSpan='1'><strong>Total {sector.sector_name}</strong></td>
		    <td className="text-end" style={tdPortStyle}><strong>{numberWithCommas(portfolioLessParSector)}</strong></td>
                    <td className="text-end" style={tdPortStyle}><strong>{numberWithCommas(sectorTotalParMonth)}</strong></td>
                    <td className="text-end" style={tdPortStyle}><strong>{numberWithCommas(sectorTotalParYear)}</strong></td>
                    <td className="text-end" style={tdPortStyle}><strong>{numberWithCommas(sectorTotalParGreaterYear)}</strong></td>
		    <td className="text-end" style={tdPortStyle}><strong>{numberWithCommas(totalParSector)}</strong></td>
		    <td className="text-end" style={tdPortStyle}><strong>{numberWithCommas(sectorTotalPrincipalBalance)}</strong></td>
		    <td className="text-end" style={tdAllowStyle}><strong>{numberWithCommas(sectorAllowCurrent)}</strong></td>
		    <td className="text-end" style={tdAllowStyle}><strong>{numberWithCommas(sectorAllowMonth)}</strong></td>
		    <td className="text-end" style={tdAllowStyle}><strong>{numberWithCommas(sectorAllowYear)}</strong></td>
		    <td className="text-end" style={tdAllowStyle}><strong>{numberWithCommas(sectorAllowGreaterYear)}</strong></td>
		</tr>
            </React.Fragment>
	);
    });
}

renderTotal() {
    const sectorData = this.state.data.records;
    let totalPrincipalBalance = 0;
    let totalParMonth = 0;
    let totalParYear = 0;
    let totalParGreaterYear = 0;
    let totalPar = 0;
    let totalPortfolioLessPar = 0;
    let totalAllowCurrentAmount = 0;
    let totalAllowMonth = 0;
    let totalAllowYear = 0;
    let totalAllowGreaterYear = 0;
        const tdPortStyle = {
    		backgroundColor: '#d7ecff'
	 	};
	const tdAllowStyle = {
	    	backgroundColor: '#8bb4ff'
	};

    sectorData.forEach((sector) => {
        sector.cluster.forEach((cluster) => {
            cluster.sato.forEach((sato) => {
                totalPrincipalBalance += sato.principal_balance;
                totalParMonth += sato.par_month;
                totalParYear += sato.par_year;
                totalParGreaterYear += sato.par_greater_year;
                totalPar += sato.par_month + sato.par_year + sato.par_greater_year;
		totalPortfolioLessPar += sato.principal_balance - (sato.par_month + sato.par_year + sato.par_greater_year);
		totalAllowCurrentAmount = totalPortfolioLessPar * 0.01
	   	totalAllowMonth = totalParMonth * 0.35;
		totalAllowYear = totalParYear * 0.35;
		totalAllowGreaterYear = totalParGreaterYear * 1;
	    });
        });
    });

	return (
        <tr>
            <td colSpan><strong>Total</strong></td>
            <td className="text-end" style={tdPortStyle}><strong>{numberWithCommas(totalPortfolioLessPar)}</strong></td>
            <td className="text-end" style={tdPortStyle}><strong>{numberWithCommas(totalParMonth)}</strong></td>
            <td className="text-end" style={tdPortStyle}><strong>{numberWithCommas(totalParYear)}</strong></td>
            <td className="text-end" style={tdPortStyle}><strong>{numberWithCommas(totalParGreaterYear)}</strong></td>
	    <td className="text-end" style={tdPortStyle}><strong>{numberWithCommas(totalPar)}</strong></td>
	    <td className="text-end" style={tdPortStyle}><strong>{numberWithCommas(totalPrincipalBalance)}</strong></td>
	    <td className="text-end" style={tdAllowStyle}><strong>{numberWithCommas(totalAllowCurrentAmount)}</strong></td>
            <td className="text-end" style={tdAllowStyle}><strong>{numberWithCommas(totalAllowMonth)}</strong></td>
            <td className="text-end" style={tdAllowStyle}><strong>{numberWithCommas(totalAllowYear)}</strong></td>
	    <td className="text-end" style={tdAllowStyle}><strong>{numberWithCommas(totalAllowGreaterYear)}</strong></td>
	</tr>
    );
}

  render() {
    if(this.state.isLoading) {
      return  (
        <SkCubeLoading/>
      );
    } else {
	return  (
	<div>
		

	<div className="tableAllowanceComputation">
          <table className="table table-lg table-bordered table-responsive">
            <thead>
            </thead>
            <tbody>
	     {this.renderSatoData()}
	     {this.renderTotal()}
            </tbody>
          </table>
          </div>
        </div>
 
      );
    }
  }
 

}
