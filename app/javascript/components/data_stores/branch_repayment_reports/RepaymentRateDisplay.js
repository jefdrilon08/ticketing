import React from 'react';

import RRLoanProduct from './RRLoanProduct';

export default class RepaymentRateDisplay extends React.Component {
  constructor(props) {
    super(props);
  }

  renderLoanProductLevel() {
    var loanProducts  = [];
    var data          = this.props.data.data;

    for(var i = 0; i < data.loan_products.length; i++) {
      loanProducts.push(
        <RRLoanProduct
          key={"lp" + i}
          data={data.loan_products[i]}
        />
      );
    }
    
    return  loanProducts;
  }

  render() {
    return  (
      <div>
        {this.renderLoanProductLevel()}
      </div>
    );
  }
}
