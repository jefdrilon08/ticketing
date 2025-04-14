module Administration
  module Suppliers
    class ValidateCreate
      def initialize(config:)
        @errors = { messages: [] }
        @config = config
        @id              = @config[:id]
        @code            = @config[:code]
        @name            = @config[:name]
        @status          = @config[:status]
        @contact_person  = @config[:contact_person]
        @contact_number  = @config[:contact_number]
        @address         = @config[:address]

        Rails.logger.debug "ValidateCreate received params: #{@config.inspect}"
      end

      def execute!
        validate_code
        validate_name
        validate_status
        # Additional validations for new fields can be added if needed

        return @errors if @errors[:messages].any?

        @errors[:full_messages] = @errors[:messages].map { |error| error[:message] }
        @errors
      end

      private

      def validate_code
        if @code.blank?
          @errors[:messages] << { key: "code", message: "Code cannot be blank." }
        elsif duplicate_code_exists?
          @errors[:messages] << { key: "suppliers", message: "A supplier with the code '#{@code}' already exists." }
        end
      end

      def validate_name
        if @name.blank?
          @errors[:messages] << { key: "name", message: "Name cannot be blank." }
        elsif duplicate_name_exists?
          @errors[:messages] << { key: "suppliers", message: "A supplier with the name '#{@name}' already exists." }
        end
      end

      def validate_status
        if @status.blank?
          @errors[:messages] << { key: "status", message: "Status cannot be blank." }
        end
      end

      def duplicate_code_exists?
        ::Supplier.where("LOWER(code) = ?", @code.to_s.downcase)
                  .where.not(id: @id)
                  .exists?
      end

      def duplicate_name_exists?
        ::Supplier.where("LOWER(name) = ?", @name.to_s.downcase)
                  .where.not(id: @id)
                  .exists?
      end
    end
  end
end
