module Administration
    module Brands
      class ValidateCreate
        def initialize(config:)
          @errors = { messages: [] }
          @config = config
          @id     = @config[:id]
          @code   = @config[:code]
          @name   = @config[:name]
        end
  
        def execute!
          validate_code
          validate_name
  
          return @errors if @errors[:messages].any?
  
          @errors[:full_messages] = @errors[:messages].map { |error| error[:message] }
          @errors
        end
  
        private
  
        def validate_code
          if @code.blank?
            @errors[:messages] << { key: "code", message: "Code cannot be blank." }
          elsif duplicate_code_exists?
            @errors[:messages] << { key: "brands", message: "A brand category with the code '#{@code}' already exists." }
          end
        end
  
        def validate_name
          if @name.blank?
            @errors[:messages] << { key: "name", message: "Name cannot be blank." }
          elsif duplicate_name_exists?
            @errors[:messages] << { key: "brands", message: "A brand category with the name '#{@name}' already exists." }
          end
        end
  
        def duplicate_code_exists?
          ::Brand.where("LOWER(code) = ?", @code.to_s.downcase)
                 .where.not(id: @id)
                 .exists?
        end
  
        def duplicate_name_exists?
          ::Brand.where("LOWER(name) = ?", @name.to_s.downcase)
                 .where.not(id: @id)
                 .exists?
        end
      end
    end
  end
