import React from "react"
import $ from "jquery";

import SkCubeLoading from '../SkCubeLoading';

export default class InsuranceStatusComponent extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			message: "Hello",
			isLoading: true,
			memberAccountId: props.id,
			data: false
		};
	}

	componentDidMount() {
		var memberAccountId = this.state.memberAccountId;
		var context         = this;

		$.ajax({
			url: "/api/v1/insurance_accounts/fetch_insurance_status",
			method: "GET",
			data: {
				member_account_id: memberAccountId
			},
			success: function(response){
				console.log(response);
				context.setState({
					isLoading: false,
					data: response
				});
			},
			error: function(response) {
				alert("Error fething data");
			}
		});
	}

	handleInputChange(event) {
		var newMessage = event.target.value;
		this.setState({
			message: newMessage
		});
	}

	handleSaveClick() {
		var message = this.state.message;
		alert(message);
	}

	render() {
		var context = this;
		var message = this.state.message;
		
		if (context.state.isLoading) {
			return (
				<SkCubeLoading />
				)
		} else {

			var recognitionDate			= context.state.data.recognition_date;
			var lengthOfMembership		= context.state.data.length_of_membership;
			var currentDate      		= context.state.data.current_date;
			var coverageDate			= context.state.data.coverage_date;
			var latestTransactionDate	= context.state.data.latest_transaction_date;
			var defaultPeriodicPayment 	= context.state.data.default_periodic_payment;
			var numWeeks				= context.state.data.num_weeks;
			var insuredAmount           = context.state.data.insured_amount;
			var currentBalance			= context.state.data.current_balance;
			var status 					= context.state.data.status;
			var amtPastDue				= context.state.data.amt_past_due;
			var numWeeksPastDue			= context.state.data.num_weeks_past_due;

			var name					= context.state.data.name;

			var badgeClassName			= "badge-light";
			if(status == "lapsed"){
				badgeClassName = "bg-danger";
			} else if(status == "advanced"){
				badgeClassName = "badge-primary";
			} else if(status == "past due"){
				badgeClassName = "bg-danger";
			}

		return (
			<div>
				<table className="table table-bordered table-sm">
					<tbody>
						<tr>
							<th>
								Recognition Date
							</th>
							<td>
								{recognitionDate}
							</td>
						</tr>
						<tr>
							<th>
								Length of Membership
							</th>
							<td>
								{lengthOfMembership}
							</td>
						</tr>
						<tr>
							<th>
								Current Date
							</th>
							<td>
								{currentDate}
							</td>
						</tr>
						<tr>
							<th>
								Coverage Date
							</th>
							<td>
								{coverageDate}
							</td>
						</tr>
						<tr>
							<th>
								Latest Transaction Date
							</th>
							<td>
								{latestTransactionDate}
							</td>
						</tr>
						<tr>
							<th>
								Number of Weeks
							</th>
							<td>
								{numWeeks} weeks
							</td>
						</tr>
						<tr>
							<th>
								Insured Amount
							</th>
							<td>
								{insuredAmount}
							</td>
						</tr>
						<tr>
							<th>
								Current Balance
							</th>
							<td>
								{currentBalance}
							</td>
						</tr>
						<tr>
							<th>
								Status
							</th>
							<td>
								<div className={"badge " + badgeClassName}>
									{status}
								</div>
							</td>
						</tr>
						<tr>
							<th>
								Amount Past Due
							</th>
							<td>
								{amtPastDue}
							</td>
						</tr>
						<tr>
							<th>
								Number of Weeks Past Due
							</th>
							<td>
								{numWeeksPastDue}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		);
	}
	}
}
