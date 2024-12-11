class ProcessApprovedCollectionForInvoluntary < ApplicationJob
    queue_as :operations

    def perform(args)
        
        data_store = DataStore.find(args[:data_store])
        user = User.find(args[:user])

        begin
        config = {
            data_store: data_store.id,
            current_user: user.id
        }

        data_store = ::BillingForInvoluntary::Approve.new(config: config).execute!
        data_store.update!(status: "approved")
        rescue Exception => e
            
                data_store.update!(
                status: "error",
                data: {
                exception: e,
                application_trace: Rails.backtrace_cleaner.clean(e.backtrace)
                }
            )
        end

    end
end