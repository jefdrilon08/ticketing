module Utils
  class IsCutoff
    def initialize(branch:)
      @branch = branch

      @current_date = ::Utils::GetCurrentDate.new(
                        config: { 
                          branch: @branch
                        }
                      ).execute!

      @cutoff_time_start  = Settings.cutoff_time_start
      @cutoff_time_end    = Settings.cutoff_time_end

      if @cutoff_time_start.blank? or @cutoff_time_end.blank?
        raise "cutoff time not specified"
      end
    end

    def execute!
      @ct_start_hour  = @cutoff_time_start.split(":").first.to_i
      @ct_start_min   = @cutoff_time_start.split(":").last.to_i

      @ct_end_hour  = @cutoff_time_end.split(":").first.to_i
      @ct_end_min   = @cutoff_time_end.split(":").last.to_i

      @current_time   = DateTime.now
      @current_hour   = @current_time.hour
      @current_minute = @current_time.min

      @current_date_time      = DateTime.new(@current_date.year, @current_date.month, @current_date.day, @current_hour, @current_minute)
      @cutoff_date_time_start = DateTime.new(@current_date.year, @current_date.month, @current_date.day, @ct_start_hour, @ct_start_min)
      @cutoff_date_time_end   = DateTime.new(@current_date.year, @current_date.month, @current_date.day, @ct_end_hour, @ct_end_min)

      @current_date_time > @cutoff_date_time_start and @current_date_time < @cutoff_date_time_end
    end
  end
end
