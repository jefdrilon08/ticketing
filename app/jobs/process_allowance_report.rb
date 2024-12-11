class ProcessAllowanceReport < ApplicationJob
  queue_as :default

  def perform(args)
      begin                                 
      record = DataStore.find(args[:data_store_id])                                 
      as_of   = args[:as_of]                                                            
      record.update!(status: "processing")                                 
                                 
      config = {                                 
        data_store_id: record.id,                                                      
        as_of: as_of                                                     
      }                                                             
                                                         
      data_result = ::DataStores::GenerateAllowanceComputationReport.new(config: config).execute!                    
      record.update!(                                                               
        #data: data_result,                                 
        status: "done"                                   
      )                                                        
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
