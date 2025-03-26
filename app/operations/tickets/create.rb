module Tickets
    class Create
        def initialize(config:)
            @config             = config
            @name               = @config[:name]
            @ticket_name        = @config[:ticket_name]
            @description        = @config[:description]
            @status             = @config[:status]
            @computer_system    = @config[:computer_system_id]
            @user_id            = @config[:user_id]
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
              ticket_name: @ticket_name,
              description: @description,
              status: @status.presence || "open",
              computer_system_id: @computer_system,
              user_id: @user_id
            )
            concern_ticket.save!
            Rails.logger.debug "SUCCESS!! Saved with Computer System ID: #{concern_ticket.computer_system_id}"
            concern_ticket
        end
    end
end
