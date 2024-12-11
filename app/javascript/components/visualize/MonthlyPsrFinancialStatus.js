import React, { useState, useMemo, useRef, useEffect } from "react";
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

export default function MonthlyPsrFinancialStatus(props) {
  const strokeWidth = 2;
  const ref = useRef(null);

  const [containerWidth, setContainerWidth] = useState(800);

  const colorGrossIncome      = "blue";
  const colorOperatingExpense = "red";
  const colorNet              = "green";

  useEffect(() =>{
    console.log('width', ref.current ? ref.current.offsetWidth : 0);
    setContainerWidth(ref.current ? ref.current.offsetWidth : 800);
  }, [ref.current])

  const buildData = (records) => {
    const _data = records.map((o) => {
      return {
        date: o.closing_date,
        gross_income: o.data.gross_income,
        operating_expense: o.data.operating_expense,
        net_income_before_admin_expense: o.data.net_income_before_admin_expense
      }
    });

    return _data;
  }

  const data = buildData(props.data);


  return (
    <>
      <h4>
        Financial Status
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
              { name: "Gross Income", symbol: { fill: colorGrossIncome } },
              { name: "Operating Expense", symbol: { fill: colorOperatingExpense } },
              { name: "Net", symbol: { fill: colorNet } }
            ]}
          />

          <VictoryScatter
            data={data}
            x="date"
            y="gross_income"
            labels={({ datum }) => numberWithCommas(datum.gross_income)}
            style={{
              data: {
                fill: colorGrossIncome
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
                stroke: colorGrossIncome,
                strokeWidth: strokeWidth
              }
            }}
            x="date"
            y="gross_income"
          />

          <VictoryScatter
            data={data}
            x="date"
            y="operating_expense"
            labels={({ datum }) => numberWithCommas(datum.operating_expense)}
            style={{
              data: {
                fill: colorOperatingExpense
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
                stroke: colorOperatingExpense,
                strokeWidth: strokeWidth
              }
            }}
            x="date"
            y="operating_expense"
          />

          <VictoryScatter
            data={data}
            x="date"
            y="net_income_before_admin_expense"
            labels={({ datum }) => numberWithCommas(datum.net_income_before_admin_expense)}
            style={{
              data: {
                fill: colorNet,
                labels: {
                  fill: colorNet
                }
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
                stroke: colorNet,
                strokeWidth: strokeWidth
              }
            }}
            x="date"
            y="net_income_before_admin_expense"
          />
        </VictoryChart>
      </div>
      <hr/>
    </>
  )
}
