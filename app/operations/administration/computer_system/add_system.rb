module Administration
    module ComputerSystem
        class AddSystem
            def initialize(config:)
                @config      = config
                @name        = @config[:name]
                @description = @config[:description]
                @status      = @config[:status]
                @id          = @config[:id]
            end

            def execute!
                if @id.blank?
                  create_system
                else
                  update_system
                end
            end

            def create_system
                computer_system = ::ComputerSystem.new(
                    name: @name,
                    description: @description,
                    status: @status,
                    data: {}
                )
                computer_system.save!
                computer_system
            end
            
        end
    end
end
