module Utils
  class MonthToFilipino
    def initialize(month)
      @month  = month
    end

    def execute!
      if @month == 1
        "enero"
      elsif @month == 2
        "pebrero"
      elsif @month == 3
        "marso"
      elsif @month == 4
        "abril"
      elsif @month == 5
        "mayo"
      elsif @month == 6
        "hunyo"
      elsif @month == 7
        "hulyo"
      elsif @month == 8
        "agosto"
      elsif @month == 9
        "setyembre"
      elsif @month == 10
        "oktubre"
      elsif @month == 11
        "nobyembre"
      elsif @month == 12
        "disyembre"
      else
        "invalid: #{@month}"
      end
    end
  end
end
