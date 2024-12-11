import React, { useState, useMemo, useRef, useEffect } from "react";
import SkCubeLoading from "../SkCubeLoading";
import axios from 'axios';
import { numberWithCommas } from "../utils/helpers";
import {
  VictoryLine,
  VictoryChart,
  VictoryAxis,
  VictoryVoronoiContainer,
  VictoryTooltip,
  VictoryScatter,
  VictoryLegend
} from 'victory';

export default function MonthlyPsrPortfolio(props) {
  const strokeWidth = 2;
  const ref = useRef(null);

  const [containerWidth, setContainerWidth] = useState(800);

  const colorDefault = "orange";

  useEffect(() =>{
    console.log('width', ref.current ? ref.current.offsetWidth : 0);
    setContainerWidth(ref.current ? ref.current.offsetWidth : 800);
  }, [ref.current])

  const buildData = (records) => {
    const _data = records.map((o) => {
      let total_overall_principal_balance = o.data.total_overall_principal_balance;

      if(!total_overall_principal_balance) {
        total_overall_principal_balance = 0.00;
      }

      return {
        date: o.closing_date,
        portfolio: total_overall_principal_balance
      }
    });

    return _data;
  }

  const data = buildData(props.data);

  console.log(data);

  return (
    <>
      <h4>
        Portfolio
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
          <VictoryScatter
            data={data}
            x="date"
            y="portfolio"
            labels={({ datum }) => numberWithCommas(datum.portfolio)}
            style={{
              data: {
                fill: colorDefault
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
                stroke: colorDefault,
                strokeWidth: strokeWidth
              }
            }}
            x="date"
            y="portfolio"
          />
        </VictoryChart>
      </div>
      <hr/>
    </>
  )
}
