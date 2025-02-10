module Administration
  module ComputerSystem
    class Delete
      def initialize(config:)
        @id = config[:id] 
      end
  
      def execute!
        computer_system = ::ComputerSystem.find_by(id: @id)
        raise "Computer System not found" unless computer_system
  
          computer_system.destroy!
          { message: 'Computer System record successfully deleted' }
        end
      end
    end
  end