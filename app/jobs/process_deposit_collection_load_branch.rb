class ProcessDepositCollectionLoadBranch < ApplicationJob
  queue_as :default

  def perform(args)
    deposit_collection  = DepositCollection.find(args[:id])
    user                = User.find(args[:user_id])

    config  = {
      deposit_collection: deposit_collection,
      user: user
    }

    ::DepositCollections::LoadBranch.new( 
      config: config
    ).execute!

    deposit_collection.update!(status: "pending")
  end
end
