module Administration
    module SubCategory
      class Delete
        def initialize(config:)
          @id = config[:id]
        end
  
        def execute!
          sub_categories = ::SubCategories.find(@id)
          sub_categories.destroy!
          { message: 'Items category record successfully deleted' }
        end
      end
    end
  end
  