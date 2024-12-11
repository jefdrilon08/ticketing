import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SkCubeLoading from '../SkCubeLoading';

function Disbursement(props) {
    const token = props.token;

    const [isLoading, setIsLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false);

    const [asOf, setAsOf] = useState("");

    const [data, setData] = useState(false);

    const fetch = async () => {
        
        let res = await axios.get(
            '/api/dashboard/disbursement?as_of=' + asOf,
            {
                headers: {
                    "X-KOINS-HQ-TOKEN": token
                }
            }
        ).catch((error) => {
            console.log(error);
            alert("Error in fetching dashboard overview");
        })

        // REMOVE HEAD OFFICE FOR DISBURSEMENT
        // const data = res.data
        // const removedHO = data.filter(data => {
        //     return data.areas.id !== 'b9659f7e-c4d5-4b8b-be3b-508bd7c6a583';
        // });
        //console.log("res.data: ", res.data);
        if (res.status === 200) {
            //console.log("res.data: ", res.data.areas);
            //data = res.data;
            //responseData = res.data;
            setData(res.data);

            setIsLoading(false);
            setIsFetching(false);
        }

    }

    function handleSyncClicked() {
        setIsFetching(true);
        //console.log("as_of: ", asOf);
        fetch();
    }

    function handleAsOfChanged(event) {
        setAsOf(event.target.value);
        //console.log("as_of: ", asOf);
    }

    var colSpan = 4;

    // COLORS
    const areaColor = "#bad5fd";
    const totalColor = "#c5ffc1";
    const branchColor = "#797979";
    const clusterColor = "#f3cf99";

    const borderColor = "#dee2e6";

    const headerSato = "10%";
    const headerDisbursement = "30%";
    const headerCollection = "60%";


    const rowDisbursementLink = "8%";
    const rowDisbursementPrincipal = "32%";
    const rowDisbursementStartDate = "30%";
    const rowDisbursementEndDate = "30%";

    const rowCollectionLink = "5%";
    const rowCollectionPrincipal = "21%";
    const rowCollectionInterest = "21%";
    const rowCollectionTotal = "21%";
    const rowCollectionStartDate = "16%";
    const rowCollectionEndDate = "16%";

    useEffect(() => {
        fetch();

    }, []);

    return (
        <>
            {isLoading ? (
                <div>
                    <SkCubeLoading />
                    <center>
                        <h6>
                            Loading Overview...
                        </h6>
                    </center>
                </div>
            ) : (
                <>
                    <div className="row">
                        <div className="col-md-10 col-xs-12">
                            <div className="form-group">
                                <input
                                    type="date"
                                    className="form-control"
                                    disabled={isFetching}
                                    //disabled={true}
                                    value={asOf}
                                    onChange={e => handleAsOfChanged(e)}
                                />
                            </div>
                        </div>
                        <div className="col-md-2 col-xs-12">
                            <div className="d-grid gap-2">
                                <button
                                    className="btn btn-primary btn-block"
                                    disabled={isFetching}
                                    //disabled={true}
                                    onClick={handleSyncClicked}
                                >
                                    <span className="bi bi-arrow-repeat" />
                                    Sync
                                </button>
                            </div>
                        </div>
                    </div>
                    <hr />
                    {isFetching ? (
                            <div>
                                <SkCubeLoading />
                                <center>
                                    <h6>
                                        Loading Overview...
                                    </h6>
                                </center>
                            </div>
                        ):(
                            <div className="table-responsive">
                                <table className="table table-sm table-bordered">
                                    <tbody>

                                        {data.areas.map((areas, areasIndex) => {
                                            // console.log("updated data: ", this.state.data);
                                            return (
                                                <>

                                                    {/* AREA HEADER */}
                                                    <tr key={"area-" + areas.id} style={{ backgroundColor: areaColor }}>
                                                        <th className="text-center" colSpan={colSpan}>
                                                            {areas.name}
                                                        </th>
                                                    </tr>
                                                    {/* CLUSTER HEADERS */}
                                                    {areas.clusters.map((clusters, clustersIndex) => {
                                                        return (
                                                            <>

                                                                <tr key={"cluster-" + clusters.id} style={{ backgroundColor: clusterColor }}>
                                                                    <th className="text-center" colSpan={colSpan}>
                                                                        {clusters.name}
                                                                    </th>
                                                                </tr>

                                                                {/* HEADERS */}
                                                                <tr key={"header-" + clusters.id} style={{ backgroundColor: branchColor, color: "white" }}>
                                                                    <th className="text-center" style={{ width: headerSato, verticalAlign: "middle" }}>
                                                                        Sato
                                                                    </th>
                                                                    {/* DISBURSEMENT TAB */}
                                                                    <th className="text-center" style={{ width: headerDisbursement, verticalAlign: "middle" }}>
                                                                        <table style={{ width: "100%" }}>
                                                                            <tr>
                                                                                <th className="text-center" style={{ borderBottom: "0.5px solid", borderColor: borderColor }} colSpan={colSpan}>
                                                                                    Disbursement
                                                                                </th>
                                                                            </tr>
                                                                            <tr>
                                                                                <th className="text-center" style={{ borderRight: "0.5px solid", borderColor: borderColor, width: rowDisbursementLink }}>
                                                                                    
                                                                                </th>
                                                                                <th className="text-center" style={{ borderRight: "0.5px solid", borderColor: borderColor, width: rowDisbursementPrincipal }}>
                                                                                    Principal
                                                                                </th>
                                                                                <th className="text-center" style={{ borderRight: "0.5px solid", borderColor: borderColor, width: rowDisbursementStartDate }}>
                                                                                    Start Date
                                                                                </th>
                                                                                <th className="text-center" style={{ width: rowDisbursementEndDate }}>
                                                                                    End Date
                                                                                </th>
                                                                            </tr>
                                                                        </table>
                                                                    </th>

                                                                    {/* COLLECTION TAB */}
                                                                    <th className="text-center" style={{ width: headerCollection, verticalAlign: "middle" }}>
                                                                        <table style={{ width: "100%" }}>
                                                                            <tbody>
                                                                                <tr>
                                                                                    <th className="text-center" style={{ borderBottom: "0.5px solid", borderColor: borderColor }} colSpan={colSpan+2}>
                                                                                        Collection
                                                                                    </th>
                                                                                </tr>

                                                                                <tr>
                                                                                    <th className="text-center" style={{ borderRight: "0.5px solid", borderColor: borderColor, width: rowCollectionLink }}>
                                                                                    
                                                                                    </th>
                                                                                    <th className="text-center" style={{ borderRight: "0.5px solid", borderColor: borderColor, width: rowCollectionPrincipal }}>
                                                                                        Principal
                                                                                    </th>
                                                                                    <th className="text-center" style={{ borderRight: "0.5px solid", borderColor: borderColor, width: rowCollectionInterest }}>
                                                                                        Interest
                                                                                    </th>
                                                                                    <th className="text-center" style={{ borderRight: "0.5px solid", borderColor: borderColor, width: rowCollectionTotal }}>
                                                                                        Total
                                                                                    </th>
                                                                                    <th className="text-center" style={{ borderRight: "0.5px solid", borderColor: borderColor, width: rowCollectionStartDate }}>
                                                                                        Start Date
                                                                                    </th>
                                                                                    <th className="text-center" style={{ width: rowCollectionEndDate }}>
                                                                                        End Date
                                                                                    </th>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>

                                                                    </th>
                                                                    

                                                                </tr>
                                                                {/* DATA BRANCH ROW */}
                                                                {clusters.branches.map((branches, branchesIndex) => {
                                                                    return (
                                                                        <>

                                                                            <tr key={"branch-" + branches.id} >
                                                                                <td>
                                                                                    <strong>
                                                                                        {/* Branch Name */}
                                                                                        {branches.name}
                                                                                    </strong>
                                                                                </td>
                                                                                <td className="text-center">
                                                                                    <table style={{ width: "100%" }}>
                                                                                        <tbody>
                                                                                            <tr>
                                                                                                <td className="text-center" style={{ width: rowDisbursementLink }}>
                                                                                                        {/* Disbursement Link Branches */}
                                                                                                        {branches.soa_expenses_id.length > 0 ? (
                                                                                                            <a href={'/data_stores/soa_expenses/'+branches.soa_expenses_id} target='_blank'>
                                                                                                                <div className='bi bi-search'>

                                                                                                                </div>
                                                                                                            </a>
                                                                                                        ):(
                                                                                                            <>
                                                                                                            </>
                                                                                                        )
                                                                                                        }
                                                                                                </td>

                                                                                                <td className="text-center" style={{ borderRight: "0.5px solid", borderColor: borderColor, width: rowDisbursementPrincipal }}>
                                                                                                        
                                                                                                        {/* Disbursement Principal Branches */}
                                                                                                        {branches.total_disbursement.toLocaleString('en-PH', {
                                                                                                            //style: 'currency',
                                                                                                            //currency: 'PHP',
                                                                                                            maximumFractionDigits: 2,
                                                                                                        })}
                                                                                                    
                                                                                                </td>

                                                                                                <td className="text-center" style={{ borderRight: "0.5px solid", borderColor: borderColor, width: rowDisbursementStartDate }}>
                                                                                                        {/* Disbursement As Of Branches */}
                                                                                                        {branches.start_date_se}
                                                                                                </td>

                                                                                                <td className="text-center" style={{ width: rowDisbursementEndDate }}>
                                                                                                        {/* Disbursement As Of Branches */}
                                                                                                        {branches.end_date_se}
                                                                                                </td>
                                                                                            </tr>
                                                                                        </tbody>
                                                                                    </table>
                                                                                        
                                                                                    
                                                                                </td>
                                                                                <td className="text-center">
                                                                                    <table style={{ width: "100%" }}>
                                                                                        <tbody>
                                                                                            <tr>
                                                                                                <td className="text-center" style={{ borderRight: "0.5px solid", borderColor: borderColor, width: rowCollectionLink }}>
                                                                                                        {/* Collection Link BRANCHES */}
                                                                                                        {branches.soa_loans_id.length > 0 ? (
                                                                                                            <a href={'/data_stores/soa_loans/'+branches.soa_loans_id} target='_blank'>
                                                                                                                <div className='bi bi-search'>

                                                                                                                </div>
                                                                                                            </a>
                                                                                                        ):(
                                                                                                            <>
                                                                                                            </>
                                                                                                        )
                                                                                                        }
                                                                                                </td>
                                                                                                <td className="text-center" style={{ borderRight: "0.5px solid", borderColor: borderColor, width: rowCollectionPrincipal }}>
                                                                                                    
                                                                                                        {/* Principal */}
                                                                                                        {branches.total_principal_paid.toLocaleString('en-PH', {
                                                                                                            //style: 'currency',
                                                                                                            //currency: 'PHP',
                                                                                                            maximumFractionDigits: 2,
                                                                                                        })}
                                                                                                    
                                                                                                </td>
                                                                                                <td className="text-center" style={{ borderRight: "0.5px solid", borderColor: borderColor, width: rowCollectionInterest }}>
                                                                                                    
                                                                                                        {/* Interest */}
                                                                                                        {branches.total_interest_paid.toLocaleString('en-PH', {
                                                                                                            //style: 'currency',
                                                                                                            //currency: 'PHP',
                                                                                                            maximumFractionDigits: 2,
                                                                                                        })}
                                                                                                    
                                                                                                </td>
                                                                                                <td className="text-center" style={{ borderRight: "0.5px solid", borderColor: borderColor, width: rowCollectionTotal }}>
                                                                                                    
                                                                                                        {/* Total */}
                                                                                                        {branches.total_paid.toLocaleString('en-PH', {
                                                                                                            //style: 'currency',
                                                                                                            //currency: 'PHP',
                                                                                                            maximumFractionDigits: 2,
                                                                                                        })}
                                                                                                    
                                                                                                </td>

                                                                                                <td className="text-center" style={{ borderRight: "0.5px solid", borderColor: borderColor, width: rowCollectionStartDate }}>
                                                                                                        {/* Start Date BRANCHES */}
                                                                                                        {branches.start_date_sl}
                                                                                                </td>

                                                                                                <td className="text-center" style={{ width: rowCollectionEndDate }}>
                                                                                                        {/* End Date BRANCHES */}
                                                                                                        {branches.end_date_sl}
                                                                                                </td>
                                                                                            </tr>
                                                                                        </tbody>
                                                                                    </table>
                                                                                </td>
                                                                                
                                                                            </tr>
                                                                        </>
                                                                    )
                                                                })} {/* END OF DATA BRANCH ROW */}


                                                                {/* CLUSTER TOTAL ROW*/}
                                                                <tr key={"cluster-total"} style={{ backgroundColor: totalColor }}>
                                                                    <td>
                                                                        <strong>
                                                                            {/* Cluster Name Total */}
                                                                            {clusters.name + " Total"}
                                                                        </strong>
                                                                    </td>
                                                                    <td className="text-center">
                                                                        <table style={{ width: "100%" }}>
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td className="text-center" style={{ borderRight: "0.5px solid", borderColor: borderColor, width: rowDisbursementLink }}>
                                                                                        <strong>
                                                                                            {/* Disbursement Link CLUSTER */}
                                                                                            {}
                                                                                        </strong>
                                                                                    </td>
                                                                                    <td className="text-center" style={{ borderRight: "0.5px solid", borderColor: borderColor, width: rowDisbursementPrincipal }}>
                                                                                            
                                                                                        <strong>
                                                                                            {/* CLUSTER Disbursement PrincipalTotal */}
                                                                                            {clusters.cluster_total_disbursement.toLocaleString('en-PH', {
                                                                                                //style: 'currency',
                                                                                                //currency: 'PHP',
                                                                                                maximumFractionDigits: 2,
                                                                                            })}
                                                                                        </strong>
                                                                                        
                                                                                    </td>

                                                                                    <td className="text-center" style={{ borderRight: "0.5px solid", borderColor: borderColor, width: rowDisbursementStartDate }}>
                                                                                            {/* CLUSTER Disbursement start Date */}
                                                                                    </td>

                                                                                    <td className="text-center" style={{ width: rowDisbursementEndDate }}>
                                                                                            {/* CLUSTER Disbursement End Date*/}
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                        
                                                                    </td>
                                                                    <td className="text-center">
                                                                        <table style={{ width: "100%" }}>
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td className="text-center" style={{ borderRight: "0.5px solid", borderColor: borderColor, width: rowCollectionLink }}>
                                                                                        <strong>
                                                                                            {/* Collection Link CLUSTER */}
                                                                                            {}
                                                                                        </strong>
                                                                                    </td>
                                                                                    <td className="text-center" style={{ borderRight: "0.5px solid", borderColor: borderColor, width: rowCollectionPrincipal }}>
                                                                                        <strong>
                                                                                            {/* Cluster Principal Total */}
                                                                                            {clusters.cluster_total_principal_paid.toLocaleString('en-PH', {
                                                                                                //style: 'currency',
                                                                                                //currency: 'PHP',
                                                                                                maximumFractionDigits: 2,
                                                                                            })}
                                                                                        </strong>
                                                                                    </td>
                                                                                    <td className="text-center" style={{ borderRight: "0.5px solid", borderColor: borderColor, width: rowCollectionInterest }}>
                                                                                        <strong>
                                                                                            {/* Cluster Interest Total */}
                                                                                            {clusters.cluster_total_interest_paid.toLocaleString('en-PH', {
                                                                                                //style: 'currency',
                                                                                                //currency: 'PHP',
                                                                                                maximumFractionDigits: 2,
                                                                                            })}
                                                                                        </strong>
                                                                                    </td>
                                                                                    <td className="text-center" style={{ borderRight: "0.5px solid", borderColor: borderColor, width: rowCollectionTotal }}>
                                                                                        <strong>
                                                                                            {/* Cluster Total Total */}
                                                                                            {clusters.cluster_total_paid.toLocaleString('en-PH', {
                                                                                                //style: 'currency',
                                                                                                //currency: 'PHP',
                                                                                                maximumFractionDigits: 2,
                                                                                            })}
                                                                                        </strong>
                                                                                    </td>
                                                                                    <td className="text-center" style={{ borderRight: "0.5px solid", borderColor: borderColor, width: rowCollectionStartDate }}>
                                                                                            {/* CLUSTER COLLECTION  Start Date*/}
                                                                                            
                                                                                    </td>
                                                                                    <td className="text-center" style={{ width: rowCollectionEndDate }}>
                                                                                            {/* CLUSTER COLLECTION End Date */}
                                                                                            
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>

                                                                    </td>
                                                                </tr>
                                                            </>
                                                        )
                                                    })}  {/* END OF CLUSTER */}

                                                    {/* AREA TOTAL ROW */}
                                                    <tr key={"area-total"} style={{ backgroundColor: areaColor }}>
                                                        <td>
                                                            <strong>
                                                                {/* Area Name Total */}
                                                                {areas.name + " Total"}
                                                            </strong>
                                                        </td>
                                                        <td className="text-center">
                                                            <table style={{ width: "100%" }}>
                                                                <tbody>
                                                                    <tr>
                                                                        <td className="text-center" style={{ borderRight: "0.5px solid", borderColor: borderColor, width: rowDisbursementLink }}>
                                                                            <strong>
                                                                                {/* Disbursement Link AREA */}
                                                                                {}
                                                                            </strong>
                                                                        </td>
                                                                        <td className="text-center" style={{ borderRight: "0.5px solid", borderColor: borderColor, width: rowDisbursementPrincipal }}>
                                                                                
                                                                            <strong>
                                                                                {/* Area Disbursement Total */}
                                                                                {areas.areas_total_disbursement.toLocaleString('en-PH', {
                                                                                    //style: 'currency',
                                                                                    //currency: 'PHP',
                                                                                    maximumFractionDigits: 2,
                                                                                })}
                                                                            </strong>
                                                                            
                                                                        </td>

                                                                        <td className="text-center" style={{ borderRight: "0.5px solid", borderColor: borderColor, width: rowDisbursementStartDate }}>
                                                                                {/* Area Disbursement start date */}
                                                                                <strong>

                                                                                </strong>
                                                                        </td>

                                                                        <td className="text-center" style={{ width: rowDisbursementEndDate }}>
                                                                                {/* Area Disbursement end date */}
                                                                                <strong>

                                                                                </strong>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            
                                                        </td>
                                                        <td className="text-center">
                                                            <table style={{ width: "100%" }}>
                                                                <tbody>
                                                                    <tr>
                                                                        <td className="text-center" style={{ borderRight: "0.5px solid", borderColor: borderColor, width: rowCollectionLink }}>
                                                                            <strong>
                                                                                {/* Collection Link AREA */}
                                                                                {}
                                                                            </strong>
                                                                        </td>
                                                                        <td className="text-center" style={{ borderRight: "0.5px solid", borderColor: borderColor, width: rowCollectionPrincipal }}>
                                                                            <strong>
                                                                                {/* Area Principal Total */}
                                                                                {areas.areas_total_principal_paid.toLocaleString('en-PH', {
                                                                                    //style: 'currency',
                                                                                    //currency: 'PHP',
                                                                                    maximumFractionDigits: 2,
                                                                                })}
                                                                            </strong>
                                                                        </td>
                                                                        <td className="text-center" style={{ borderRight: "0.5px solid", borderColor: borderColor, width: rowCollectionInterest }}>
                                                                            <strong>
                                                                                {/* Area Interest Total */}
                                                                                {areas.areas_total_interest_paid.toLocaleString('en-PH', {
                                                                                    //style: 'currency',
                                                                                    //currency: 'PHP',
                                                                                    maximumFractionDigits: 2,
                                                                                })}
                                                                            </strong>
                                                                        </td>
                                                                        <td className="text-center" style={{ borderRight: "0.5px solid", borderColor: borderColor, width: rowCollectionTotal }}>
                                                                            <strong>
                                                                                {/* Area Total Total */}
                                                                                {areas.areas_total_paid.toLocaleString('en-PH', {
                                                                                    //style: 'currency',
                                                                                    //currency: 'PHP',
                                                                                    maximumFractionDigits: 2,
                                                                                })}
                                                                            </strong>
                                                                        </td>
                                                                        <td className="text-center" style={{ borderRight: "0.5px solid", borderColor: borderColor, width: rowCollectionStartDate }}>
                                                                            <strong>
                                                                                {/* Area As Of start date */}
                                                                            </strong>
                                                                        </td>
                                                                        <td className="text-center" style={{ width: rowCollectionEndDate }}>
                                                                            <strong>
                                                                                {/* Area As Of end date */}
                                                                            </strong>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>

                                                        </td>
                                                        
                                                    </tr>
                                                    <br />

                                                </>
                                            )
                                        })} {/* END OF AREA */}

                                        {/* GRAND TOTAL */}
                                        <tr key={"grand-total"} style={{ backgroundColor: "#000", color: "#fff" }}>
                                            <td>
                                                <strong>
                                                    {/* Grand Total */}
                                                    Grand Total
                                                </strong>
                                            </td>
                                            <td className="text-center">
                                                <table style={{ width: "100%" }}>
                                                    <tbody>
                                                        <tr>
                                                            <td className="text-center" style={{ borderRight: "0.5px solid", borderColor: borderColor, width: rowDisbursementLink }}>
                                                                <strong>
                                                                    {/* Disbursement Link GRAND */}
                                                                    {}
                                                                </strong>
                                                            </td>
                                                            <td className="text-center" style={{ borderRight: "0.5px solid", borderColor: borderColor, width: rowDisbursementPrincipal }}>
                                                                    
                                                                <strong>
                                                                    {/* Grand Disbursement Total */}
                                                                    {data.grand_total_disbursement.toLocaleString('en-PH', {
                                                                        //style: 'currency',
                                                                        //currency: 'PHP',
                                                                        maximumFractionDigits: 2,
                                                                    })}
                                                                </strong>
                                                                
                                                            </td>

                                                            <td className="text-center" style={{ borderRight: "0.5px solid", borderColor: borderColor, width: rowDisbursementStartDate }}>
                                                                    {/* Grand Disbursement Start Date */}
                                                                    <strong>

                                                                    </strong>
                                                            </td>

                                                            <td className="text-center" style={{ width: rowDisbursementEndDate }}>
                                                                    {/* Grand Disbursement End Date */}
                                                                    <strong>

                                                                    </strong>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                
                                            </td>
                                            <td className="text-center">
                                                <table style={{ width: "100%" }}>
                                                    <tbody>
                                                        <tr>
                                                            <td className="text-center" style={{ borderRight: "0.5px solid", borderColor: borderColor, width: rowCollectionLink }}>
                                                                <strong>
                                                                    {/* Collection Link GRAND */}
                                                                    {}
                                                                </strong>
                                                            </td>
                                                            <td className="text-center" style={{ borderRight: "0.5px solid", borderColor: borderColor, width: rowCollectionPrincipal }}>
                                                                <strong>
                                                                    {/* Grand Principal Total */}
                                                                    {data.grand_total_principal_paid.toLocaleString('en-PH', {
                                                                        //style: 'currency',
                                                                        //currency: 'PHP',
                                                                        maximumFractionDigits: 2,
                                                                    })}
                                                                </strong>
                                                            </td>
                                                            <td className="text-center" style={{ borderRight: "0.5px solid", borderColor: borderColor, width: rowCollectionInterest }}>
                                                                <strong>
                                                                    {/* Grand Interest Total */}
                                                                    {data.grand_total_interest_paid.toLocaleString('en-PH', {
                                                                        //style: 'currency',
                                                                        //currency: 'PHP',
                                                                        maximumFractionDigits: 2,
                                                                    })}
                                                                </strong>
                                                            </td>
                                                            <td className="text-center" style={{ borderRight: "0.5px solid", borderColor: borderColor, width: rowCollectionTotal }}>
                                                                <strong>
                                                                    {/* Grand Total Total */}
                                                                    {data.grand_total_paid.toLocaleString('en-PH', {
                                                                        //style: 'currency',
                                                                        //currency: 'PHP',
                                                                        maximumFractionDigits: 2,
                                                                    })}
                                                                </strong>
                                                            </td>
                                                            <td className="text-center" style={{ borderRight: "0.5px solid", borderColor: borderColor, width: rowCollectionStartDate }}>
                                                                <strong>
                                                                    {/* Grand Start Date */}
                                                                </strong>
                                                            </td>

                                                            <td className="text-center" style={{ width: rowCollectionEndDate }}>
                                                                <strong>
                                                                    {/* Grand End Date */}
                                                                </strong>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>

                                            </td>
                                        </tr>

                                    </tbody>
                                </table>
                            </div>
                        )
                    }
                    
                </>
            )}
        </>

    )
}

export default Disbursement