import React, { useState, useEffect } from "react";
import Modal from 'react-bootstrap/Modal';
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap
} from 'react-leaflet';
import axios from "axios";
import {numberAsPercent, numberWithCommas} from '../utils/helpers';

export default function MapOverview(props) {
  const [centerLat, setCenterLat] = useState(props.centerLat || 14.6091);
  const [centerLon, setCenterLon] = useState(props.centerLon || 121.0223);

  return (
    <>
      <MapContainer
        center={[centerLat, centerLon]}
        zoom={13}
        scrollWheelZoom={true}
        style={{
          height: "600px"
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {(() => {
          branchData = [];

          props.data.areas.forEach((area) => {
            area.clusters.forEach((cluster) => {
              cluster.branches.forEach((branch) => {
                branchData.push(branch);
              });
            })
          });

          return (
            branchData.map((branchMarker) => {
              return (
                <Marker
                  key={`branch-marker-${branchMarker.id}`}
                  position={{ lat: branchMarker.lat, lng: branchMarker.lon }}
                >
                  <Popup
                    maxHeight="auto"
                  >
                    <div className="card">
                      <div className="card-body">
                        <h4>
                          {branchMarker.name}
                        </h4>
                        <hr/>
                        <table className="table table-bordered table-sm"> 
                          <tbody>
                            <tr>
                              <th>
                                <strong>
                                  Portfolio
                                </strong>
                              </th>
                              <td>
                                {numberWithCommas(branchMarker.data.portfolio)}
                              </td>
                            </tr>
                            <tr>
                              <th>
                                <strong>
                                  Past Due Amount
                                </strong>
                              </th>
                              <td>
                                {numberWithCommas(branchMarker.data.principal_balance)}
                              </td>
                            </tr>
                            <tr>
                              <th>
                                <strong>
                                  PAR Amount
                                </strong>
                              </th>
                              <td>
                                {numberWithCommas(branchMarker.data.par_amount)}
                              </td>
                            </tr>
                            <tr>
                              <th>
                                <strong>
                                  PAR Rate
                                </strong>
                              </th>
                              <td>
                                {numberAsPercent(branchMarker.data.par)}
                              </td>
                            </tr>
                            <tr>
                              <th>
                                <strong>
                                  RR
                                </strong>
                              </th>
                              <td>
                                {numberAsPercent(branchMarker.data.principal_rr)}
                              </td>
                            </tr>
                            <tr>
                              <th>
                                <strong>
                                  Pure Savers
                                </strong>
                              </th>
                              <td>
                                {branchMarker.data.pure_savers.total}
                              </td>
                            </tr>
                            <tr>
                              <th>
                                <strong>
                                  Active Borrowers
                                </strong>
                              </th>
                              <td>
                                {branchMarker.data.loaners.total}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              )
            })
          )
        })()}
      </MapContainer>
      <hr/>
    </>
  )
}
