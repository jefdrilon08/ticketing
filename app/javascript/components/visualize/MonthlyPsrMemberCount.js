import React, { useState, useMemo, useRef, useEffect } from "react";
import SkCubeLoading from "../SkCubeLoading";
import axios from 'axios';
import {
  VictoryLine,
  VictoryChart,
  VictoryAxis,
  VictoryVoronoiContainer,
  VictoryTooltip,
  VictoryScatter,
  VictoryLegend
} from 'victory';

export default function MonthlyPsrMemberCount(props) {
  const strokeWidth = 2;
  const ref = useRef(null);

  const [containerWidth, setContainerWidth] = useState(800);

  const colorResigned = "red";
  const colorActiveBorrowers = "green";
  const colorPureSavers = "blue";
  const colorAdmitted = "black";

  useEffect(() =>{
    console.log('width', ref.current ? ref.current.offsetWidth : 0);
    setContainerWidth(ref.current ? ref.current.offsetWidth : 800);
  }, [ref.current])

  const buildData = (records) => {
    const _data = records.map((o) => {
      const active_borrowers = o.data.active_borrowers ? o.data.active_borrowers : 0;
      const pure_savers = o.data.pure_savers ? o.data.pure_savers : 0;
      const admitted = o.data.admitted ? o.data.admitted : 0;
      const resigned = o.data.resigned ? o.data.resigned : 0;

      return {
        date: o.closing_date,
        active_borrowers: active_borrowers,
        pure_savers: pure_savers,
        admitted: admitted,
        resigned: resigned
      }
    });

    return _data;
  }

  const data = buildData(props.data);

  console.log(data);

  return (
    <>
      <h4>
        Member Count
      </h4>
      <hr/>
      <div
        ref={ref}
        style={{
          width: "100%",
          height: "450px"
        }}
      >
        <VictoryChart
          domainPadding={20}
          containerComponent={<VictoryVoronoiContainer/>}
          width={containerWidth - 600}
        >
          <VictoryLegend
            x={70} y={50}
            title="Legend"
            centerTitle
            orientation="horizontal"
            gutter={20}
            style={{ border: { stroke: "black" }, title: {fontSize: 14 } }}
            data={[
              { name: "Active Borrowers", symbol: { fill: colorActiveBorrowers } },
              { name: "Pure Savers", symbol: { fill: colorPureSavers } },
              { name: "Admitted", symbol: { fill: colorAdmitted } },
              { name: "Resigned", symbol: { fill: colorResigned } }
            ]}
          />

          <VictoryScatter
            data={data}
            x="date"
            y="active_borrowers"
            labels={({ datum }) => (datum.active_borrowers)}
            style={{
              data: {
                fill: colorActiveBorrowers
              }
            }}
            labelComponent={
              <VictoryTooltip
                cornerRadius={0}
              />
            }
          />
          <VictoryLine
            data={data}
            style={{
              data: {
                stroke: colorActiveBorrowers,
                strokeWidth: strokeWidth
              }
            }}
            x="date"
            y="active_borrowers"
          />

          <VictoryScatter
            data={data}
            x="date"
            y="pure_savers"
            labels={({ datum }) => (datum.pure_savers)}
            style={{
              data: {
                fill: colorPureSavers
              }
            }}
            labelComponent={
              <VictoryTooltip
                cornerRadius={0}
              />
            }
          />
          <VictoryLine
            data={data}
            style={{
              data: {
                stroke: colorPureSavers,
                strokeWidth: strokeWidth
              }
            }}
            x="date"
            y="pure_savers"
          />

          <VictoryScatter
            data={data}
            x="date"
            y="admitted"
            labels={({ datum }) => (datum.admitted)}
            style={{
              data: {
                fill: colorAdmitted
              }
            }}
            labelComponent={
              <VictoryTooltip
                cornerRadius={0}
              />
            }
          />
          <VictoryLine
            data={data}
            style={{
              data: {
                stroke: colorAdmitted,
                strokeWidth: strokeWidth
              }
            }}
            x="date"
            y="admitted"
          />

          <VictoryScatter
            data={data}
            x="date"
            y="resigned"
            labels={({ datum }) => (datum.resigned)}
            style={{
              data: {
                fill: colorResigned
              }
            }}
            labelComponent={
              <VictoryTooltip
                cornerRadius={0}
              />
            }
          />
          <VictoryLine
            data={data}
            style={{
              data: {
                stroke: colorResigned,
                strokeWidth: strokeWidth
              }
            }}
            x="date"
            y="resigned"
          />
        </VictoryChart>
      </div>
      <hr/>
    </>
  )
}
