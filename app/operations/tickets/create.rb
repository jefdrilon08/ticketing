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
            @is_private         = @config[:is_private]
            @connect_to_item    = @config[:connect_to_item]
            @auto_close_days    = @config[:auto_close_days].to_i
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
              data: {
                auto_close_days: @auto_close_days
              },
              computer_system_id: @computer_system,
              user_id: @user_id,
              is_private: @is_private,
              connect_to_item: @connect_to_item,
              status: @status.presence || "open"
            )
            concern_ticket.save!
            Rails.logger.debug "SUCCESS!! Saved with Computer System ID: #{concern_ticket.computer_system_id}"
            concern_ticket
        end
    end
end
