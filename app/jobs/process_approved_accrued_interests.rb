class ProcessApprovedAccruedInterests < ApplicationJob
  queue_as :operations
  
  def perform(args)
    accrued_interest = AccruedInterest.find(args[:id])
    user = User.find(args[:user_id])
   
          config = {
                      accrued_interest: accrued_interest,
                      user: user
                    }
  

    ::Adjustments::AccruedInterests::ApprovedAccruedInterests.new(config: config).execute!
  end



end
