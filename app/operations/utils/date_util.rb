module Utils
  class DateUtil
    def initialize(date:)
      @date = date
    end

    def next_business_day
      skip_weekends(@date, 1)
    end    

    def previous_business_day
      skip_weekends(@date, -1)
    end

    def skip_weekends(date, inc)
      date += inc

      while (date.wday % 7 == 0) or (date.wday % 7 == 6) do
      #while (date.wday % 7 == 0)  do
        date += inc
      end   

      date
    end

    def current_working_day
    end
  end
end
