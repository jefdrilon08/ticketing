module Administration
    module Brands
      class Delete
        def initialize(config:)
          @id = config[:id]
        end
  
        def execute!
          brand = ::Brand.find(@id)   
          brand.destroy!
          { message: 'Brand successfully deleted' }
        end
      end
    end
  end
  