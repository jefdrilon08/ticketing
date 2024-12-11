module Utils
  class GetLastWorkingDay
    def initialize(some_date:)
      @some_date  = some_date
    end

    def execute!
      day = @some_date.end_of_month + 1.day

      loop do
        day = day.prev_day
        break unless day.saturday? or day.sunday?
      end

      day
    end
  end
end
