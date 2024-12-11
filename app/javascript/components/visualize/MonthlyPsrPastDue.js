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

export default function MonthlyPsrPastDue(props) {
  const strokeWidth = 2;
  const ref = useRef(null);

  const [containerWidth, setContainerWidth] = useState(800);

  const colorDefault = "red";

  useEffect(() =>{
    console.log('width', ref.current ? ref.current.offsetWidth : 0);
    setContainerWidth(ref.current ? ref.current.offsetWidth : 800);
  }, [ref.current])

  const buildData = (records) => {
    const _data = records.map((o) => {
      let total_principal_due = o.data.total_principal_due;

      if(!total_principal_due) {
        total_principal_due = 0.00;
      }

      return {
        date: o.closing_date,
        past_due: total_principal_due
      }
    });

    return _data;
  }

  const data = buildData(props.data);

  console.log(data);

  return (
    <>
      <h4>
        Past Due
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
            y="past_due"
            labels={({ datum }) => numberWithCommas(datum.past_due)}
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
            y="past_due"
          />
        </VictoryChart>
      </div>
      <hr/>
    </>
  )
}
