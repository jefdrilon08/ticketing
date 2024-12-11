class ProcessBeneficiariesFile < ApplicationJob
  queue_as :default

  def perform(args)
    actual_url  = args[:actual_url]

    ::Imports::ImportBeneficiaries.new(
      actual_url: actual_url
    ).execute!
  end
end