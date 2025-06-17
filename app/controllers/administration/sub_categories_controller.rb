module Administration
  class SubCategoriesController < ApplicationController
    before_action :authenticate_user!

    def index
      @categories = ::ItemsCategory.all

      # Start with all subcategories
      @items_category_list = ::SubCategory.all

      # Filter by query (search by name or code)
      if params[:query].present?
        @items_category_list = @items_category_list.where(
          "name ILIKE :q OR code ILIKE :q",
          q: "%#{params[:query]}%"
        )
      end

      # Filter by category
      if params[:category_id].present?
        @items_category_list = @items_category_list.where(category_id: params[:category_id])
      end

      @sub_categories_list = ::SubCategory.order(:name)
      @subheader_side_actions = [
        {
          id: "btn-new",
          link: "#",
          class: "fa fa-plus",
          text: "New"
        }
      ]
      @item_categories = ::ItemsCategory.all
    end

    def new
      @item_categories = ::ItemsCategory.all
    end
  end
end
