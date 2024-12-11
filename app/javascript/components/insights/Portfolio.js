import React from "react";

export default class Portfolio extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: props.data
    }

    console.log(this.state);
  }

  componentDidMount() {
    var context = this.state;

    if(context.data) {
    }
  }

  componentDidUpdate() {
    var context = this.state;
  }

  render() {
    var context = this.state;

    console.log(context.data);

    if(context.data) {
      var tempData  = [
                        { name: "Page A", uv: 400, pv: 2400, amt: 205 },
                        { name: "Page B", uv: 410, pv: 2400, amt: 205 },
                        { name: "Page C", uv: 420, pv: 2400, amt: 205 },
                        { name: "Page D", uv: 430, pv: 2400, amt: 205 },
                        { name: "Page E", uv: 440, pv: 2400, amt: 205 },
                        { name: "Page F", uv: 450, pv: 2400, amt: 205 }
                      ];
      return  <div>
                <h5>Portfolio</h5>
                <ResponsiveContainer width="100%" height={450}>
                  <LineChart
                    width={400}
                    height={400}
                    data={tempData}
                  >
                    <Line type="monotone" dataKey="uv" stroke="#8884d8" />
                    <Tooltip />
                    <CartesianGrid stroke="#ccc" />
                    <XAxis dataKey="name" />
                    <YAxis />
                  </LineChart>
                </ResponsiveContainer>
              </div>
    } else {
      return  <div>
                No Data
              </div>
    }
  }
}
