class ProcessBillingUpdate < ApplicationJob
  queue_as :operations

  def perform(args)
    billing = Billing.find(args[:id])
    user    = User.find(args[:user_id])
    data    = args[:data]
    changes = args[:changes]

    invalid_operations  = []

    changes.each do |o|
    end

    data[:invalid_operations] = invalid_operations

    billing.update!(
      status: "pending",
      data: data
    )
  end
end
