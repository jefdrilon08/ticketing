class ProcessPostClaim < ApplicationJob
  queue_as :default

  def perform(args)
    claim = Claim.find(args[:id])
    user  = User.find(args[:user_id])

    begin
      config  = {
        claim: claim,
        user: user
      }
      
      ::Claims::PostClaim.new(
                                config: config
                              ).execute!

    rescue Exception => e
      claim.update!(
        status: "pending"
      )
    end
  end
end