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
        validate_name
        validate_status
        validate_computer_system_id
      
        return @errors if @errors[:messages].any?
      
        @errors[:full_messages] = @errors[:messages].map { |o| o[:message] }
        @errors
      end
      
      private
      
      def validate_computer_system_id
        if @config[:computer_system_id].blank? || !::ComputerSystem.exists?(id: @config[:computer_system_id])
          @errors[:messages] << {
            key: "computer_system_id",
            message: "Computer system must exist."
          }
        end
      end
      

      private

      def validate_name
        if @name.blank?
          @errors[:messages] << {
            key: "name",
            message: "Name cannot be blank."
          }
        elsif duplicate_name_exists?
          @errors[:messages] << {
            key: "computer_system",
            message: "Computer system with name '#{@name}' already exists."
          }
        end
      end

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
  