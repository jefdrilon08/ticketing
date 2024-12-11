class ProcessImportInsuranceAccountTransaction < ApplicationJob
  queue_as :default

  def perform(args)
    # create background operation with status, processing, started_at, ended_at
    file        = args[:file]
    # data_store  = DataStore.where(args[:data_store_id]).first
    data_store  = DataStore.find(args[:data_store_id])


    if data_store.blank?
      data_store.update!(
        status: "error",
        data: {
          exception: "Data store not found: #{args[:data_store_id]}"
        }
      )
    else
      begin
        Insurance::ImportInsuranceAccountTransactionsFromCsvFile.new(file: file).execute!
    
        data            = data_store.data.with_indifferent_access
        data[:time_end] = Time.now

        data_store.update!(
          status: "done",
          data: data
        )
      rescue Exception => e
        logger.info "Insurance Import: #{e}"
        logger.info e
        data_store.update!(
          status: "error",
          data: {
            exception: e
          }
        )
      end
    end
  end
end