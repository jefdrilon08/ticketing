class ProcessApproveLoan < ApplicationJob
  queue_as :operations

  def perform(args)
    loan    = Loan.find(args[:id])
    user    = User.find(args[:user_id])

    current_date  = ::Utils::GetCurrentDate.new(
                      config: {
                        branch: loan.branch
                      }
                    ).execute!

    begin
      config  = {
        loan: loan,
        user: user
      }

      loan  = ::Loans::Approve.new(
                config: config
              ).execute!

      # setup maintaining balance
      ::Members::SetMaintainingBalance.new(
        config: {
          member: loan.member
        }
      ).execute!

      # setup maturity date
      ::Loans::UpdateMaturityDate.new(
        loan: loan
      ).execute!

      # Setup original maturity date
      ::Loans::UpdateOriginalMaturityDate.new(
        loan: loan
      ).execute!

      # For restructured loans
      if loan.restructured?
        ::Loans::AdjustRestructuredLoans.new(
          loan: loan,
          user: user,
          date_paid: current_date
        ).execute!
      end

      ActivityLog.create!(
        content: "#{user.full_name} approved loan #{loan.id}",
        activity_type: "approval",
        data: {
          user_id: user.id,
          loan_id: loan.id
        }
      )
    rescue Exception => e
      logger.info "LOAN EXCEPTION #{e} Loan ID: #{loan.try(:id)}"
      logger.info "BACKTRACE #{e.backtrace}"
      loan.update!(status: "pending")
    end
  end
end
