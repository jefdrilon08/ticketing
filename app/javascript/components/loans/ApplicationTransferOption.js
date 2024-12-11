import React from "react";

export default class ApplicationTransferOption extends React.Component{
	constructor(props){
		super(props);

		this.state = {

		}
	}
	handleBankTransferOptionChanged(event) {
		var data = this.props.data;

		data.bank_id = event.target.value;

		this.props.updateData(data);
	}

	render() {
		var bankTransferOptions = [];

		bankTransferOptions.push(
			<option key={"transfer-select"}>
				-- SELECT --
			</option>
		);

		var TransferOptions = [];
		TransferOptions.push(
			<option key={"bank-select"}>
				-- SELECT --
			</option>
		);

		for(var i = 0; i < this.props.optionTransfer.length; i++) {
			if(this.props.optionTransfer[i].id == this.props.currentBankTransferId) {
				for(var j = 0; j < this.props.optionTransfer[i].bank_transfers.length; j++) {
					TransferOptions.push(
						<option key={"bank-option-" + this.props.optionTransfer[i].bank_transfers[j].id} value={this.props.optionTransfer[i].bank_transfers[j].id}>
						{this.props.optionTransfer[i].bank_transfers[j].name}
					</option>
					);
				}
			}
			bankTransferOptions.push(
				<option
					key={"transfer-option-" + i}
					value={this.props.optionTransfer[i].id}
				>
					{this.props.optionTransfer[i].name}
				</option>
			);
		}
		return (
			<div>
				<div className="row">
					<div className="col">
						<div className="form-group">
							<label>
								Transfer Option
							</label>
							<select
								onChange={this.props.handleTransferOptionChanged.bind(this)}
								className="form-control"
								value={this.props.currentBankTransferId}
								disabled={this.props.disabled}
							>
								{bankTransferOptions}
							</select>
						</div>
					</div>
					<div className="col">
						<div className="form-group">
						<label>
							Bank & Ewallet
						</label>
						<select
							className="form-control"
							disabled={this.props.disabled}
							value={this.props.data.bank_id}
							onChange={this.handleBankTransferOptionChanged.bind(this)}
						>
							{TransferOptions}
						</select>
						</div>
					</div>
				</div>	
			</div>
		);
	}
}