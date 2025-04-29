module Administration
  class SubCategoriesController < ApplicationController
    before_action :authenticate_user!

    def index
      @sub_categories_list = ::SubCategory.order(:name)  # Use :: to avoid namespace issues
      @subheader_side_actions = [
        {
          id: "btn-new",
          link: "#",
          class: "fa fa-plus",
          text: "New"
        }
      ]
      sub_categories = SubCategory.all
      @items_category_list = SubCategory.all
      @item_categories = ::ItemsCategory.all 

    end

    def new
      @item_categories = ::ItemsCategory.all  
    end
  end
end
