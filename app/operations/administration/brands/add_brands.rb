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
          create_brand
        end
  
        private
  
        def create_brand
          brand = ::Brand.new(
            name:    @name,
            code:    @code,
            item_id: @item_id
          )
          brand.save!
          brand
        end
      end
    end
  end
  