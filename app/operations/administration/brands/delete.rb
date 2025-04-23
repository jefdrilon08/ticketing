module Administration
    module Brands
      class Delete
        def initialize(config:)
          @id = config[:id]
        end
  
        def execute!
          brands = ::Brands.find(@id)   
          brands.destroy!
          { message: 'Brand successfully deleted' }
        end
      end
    end
  end
  