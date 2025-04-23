module Administration
    module Brands
      class AddBrands
        def initialize(config:)
          @config  = config
          @name    = @config[:name]
          @code    = @config[:code]
          @item_id = @config[:item_id]
        end
  
        def execute!
          create_brands
        end
  
        private
  
        def create_brands
          brands = ::Brand.new(
            name:    @name,
            code:    @code,
            item_id: @item_id
          )
          brands.save!
          brands
        end
      end
    end
  end
  