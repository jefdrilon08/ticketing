class ProcessForWriteoff< ApplicationJob
  queue_as :default

  def perform(args)
    
    record    = DataStore.find(args[:id])
    year      = args[:year]
    number_of_years = args[:number_of_years]
    branch_id = args[:branch_id]
    user_id   = args[:user_id]
    branch    = Branch.find(branch_id)
    user      = User.find(user_id)

    begin
      config  = {
        id: record.id,
        year: year,
        number_of_years: number_of_years,
        branch: branch,
        user: user
      }
     
      data_store  = DataStores::SaveForWriteoff.new(
                      config: config
                    ).execute!

    rescue Exception => e
      record.update!(
        status: "error",
        data: {
          exception: e,
          application_trace: Rails.backtrace_cleaner.clean(e.backtrace)
        }
      )
    end
  end
end
