class ProcessExcelReport < ApplicationJob
  queue_as :default

  def perform(args)
    branch_id = args[:branch_id]
    report_date = args[:report_date]
    filename = "midas.xlsx"
    begin
      config = {
        branch_id: branch_id, 
        report_date: report_date
      }
      
      excel = ExcelReports::GenerateReportPods.new(config: config).execute!
      excel.serialize "#{Rails.root}/tmp/#{filename}" 
      send_file "#{Rails.root}/tmp/#{filename}", filename: "#{filename}",type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      #raise args.inspect
    end
  end
end
