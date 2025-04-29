module Administration
    module SubCategories
      class ValidateCreate
        def initialize(config:)
          @errors = { messages: [] }
          @config = config
          @id     = @config[:id]
          @code   = @config[:code]
          @name   = @config[:name]
          @category_id = @config[:category_id]
        end
  
        def execute!
          validate_code
          validate_name
          validate_status
  
          return @errors if @errors[:messages].any?
  
          @errors[:full_messages] = @errors[:messages].map { |error| error[:message] }
          @errors
        end
  
        private
  
        def validate_code
          if @code.blank?
            @errors[:messages] << { key: "code", message: "Code cannot be blank." }
          elsif duplicate_code_exists?
            @errors[:messages] << { key: "items_category", message: "An items category with the code '#{@code}' already exists." }
          end
        end
  
        def validate_name
          if @name.blank?
            @errors[:messages] << { key: "name", message: "Name cannot be blank." }
          elsif duplicate_name_exists?
            @errors[:messages] << { key: "items_category", message: "An items category with the name '#{@name}' already exists." }
          end
        end
  
        def validate_status
          if @status.blank?
            @errors[:messages] << { key: "status", message: "Status cannot be blank." }
          end
        end
  
        def duplicate_code_exists?
          ::SubCategories.where("LOWER(code) = ?", @code.to_s.downcase)
                        .where.not(id: @id)
                        .exists?
        end
  
        def duplicate_name_exists?
          ::SubCategories.where("LOWER(name) = ?", @name.to_s.downcase)
                        .where.not(id: @id)
                        .exists?
        end
      end
    end
  end
  