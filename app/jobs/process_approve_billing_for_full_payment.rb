class ProcessApproveBillingForFullPayment < ApplicationJob
  queue_as :operations

  def perform(args)
    
    data_store_id = args[:data_store_id]
    @full_payment_billing = args[:full_payment_billing]
    @user    = User.find(args[:user_id])
    begin
      
      ActiveRecord::Base.transaction do
        approved_record = ::BillingForFullPayments::ApprovedBillingForFullPayment.new(data_store_id: data_store_id).execute!    
        @record = ::BillingForFullPayments::BuildAccountingEntry.new(
                                                                    full_payment_billing: @full_payment_billing,
                                                                    current_user: @user
                                                                  ).execute!

          configA  = {
            accounting_entry_data: @record,
            user: @user
          }
          accounting_entry  = ::Accounting::AccountingEntries::Save.new(
                            config: configA
                          ).execute!


          configB  = {
            accounting_entry: accounting_entry,
            user: @user
          }
          @accounting_entry = ::Accounting::AccountingEntries::Approve.new(
                            config: configB
                          ).execute!


      
           @full_payment_billing.meta["data"]["accounting_entry_id"] = @accounting_entry["id"]
           
           @full_payment_billing.status = "approved"
           @full_payment_billing.save!
         

      end
    rescue Exception => e
      logger.info "Exception occurred!"
      logger.info e
      billing.update!(
        status: "pending"
      )
    end
  end
end
