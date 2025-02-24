module Tickets
    class Create
        def initialize(config:)
            @config      = config
            @name        = @config[:name]
            @description = @config[:description]
            @status      = @config[:status]
            @id          = @config[:id]
        end
        
        def execute!
            if @id.blank?
                create_concern
            else
                update_concern
            end
        end
        
        def create_concern
            concern_ticket = ::ConcernTicket.new(
              name: @name,
              description: @description,
              status: @status,
              computer_system_id: @config[:computer_system_id]
            )
            concern_ticket.save!
            Rails.logger.debug "SUCCESS!! Saved with Computer System ID: #{concern_ticket.computer_system_id}"
            concern_ticket
          end
        
    end
end
