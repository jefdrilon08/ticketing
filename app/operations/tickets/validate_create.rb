module Tickets
    class ValidateCreate
      
      def initialize(config:)
        @errors = { messages: [] }
        @config = config
        @id = @config[:id] 
        @name = @config[:name]
        @description = @config[:description]
        @status = @config[:status]
      end

      def execute!
        validate_status
      
        return @errors if @errors[:messages].any?
      
        @errors[:full_messages] = @errors[:messages].map { |o| o[:message] }
        @errors
      end
      
      private

      def validate_status
        if @status.blank?
          @errors[:messages] << {
            key: "status",
            message: "Status cannot be blank."
          }
        end
      end

      def duplicate_name_exists?
        ::ComputerSystem
          .where("LOWER(name) = ?", @name.downcase)
          .where.not(id: @id) 
          .exists?
      end
    end
  end
  