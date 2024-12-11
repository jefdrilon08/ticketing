class Validator
  attr_accessor :errors, 
                :num_errors

  def initialize
    @num_errors = 0

    @errors = {}
  end

  def valid?
    @num_errors == 0
  end

  def invalid?
    !valid?
  end

  def count_errors!
    @errors.each do |key, errs|
      if errs.length > 0 and errs[0].class == String
        @num_errors += errs.length
      end

      if errs.length > 0 and errs[0].class == Hash
        errs.each do |err|
          if err.present?
            err.each do |k, e|
              if e.length > 0
                @num_errors += e.length
              end
            end
          end
        end
      end
    end
  end
end
