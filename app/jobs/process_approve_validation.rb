class ProcessApproveValidation < ApplicationJob
  queue_as :operations

  def perform(args)
    member_account_validation = MemberAccountValidation.find(args[:id])
    user                      = User.find(args[:user_id])

    begin
      config  = {
        member_account_validation: member_account_validation,
        user: user
      }
      
      ::MemberAccountValidations::ApproveMemberAccountValidation.new(
                                              config: config
                                            ).execute!
    rescue Exception => e
      member_account_validation.update!(
        status: "pending"
      )
    end
  end
end
