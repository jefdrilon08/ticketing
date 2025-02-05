module Administration
  module ComputerSystem
    class Update
      def initialize(config:)
        @config = config
        @computer_system = ::ComputerSystem.find(config[:id])
        @name = @config[:name]
        @description = @config[:description]
        @status = @config[:status]
      end
  
      def execute!
        @computer_system.update!(
          name: @name,
          description: @description,
          status: @status
        )
        @computer_system # Return the updated record
      end
    end
  end
end