import React from 'react';

import ParLoanProduct from './ParLoanProduct';

export default class ParDisplay extends React.Component {
  constructor(props) {
    super(props);
  }

  renderLoanProductLevel() {
    var loanProducts  = [];
    var data          = this.props.data.data;

    for(var i = 0; i < data.loan_products.length; i++) {
      loanProducts.push(
        <ParLoanProduct
          key={"lp" + i}
          data={data.loan_products[i]}
          parBinHeaders={data.par_bin_headers}
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
