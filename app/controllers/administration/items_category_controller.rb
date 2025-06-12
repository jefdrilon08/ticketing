module Administration
  class ItemsCategoryController < ApplicationController
    before_action :authenticate_user!

    def index
      @subheader_side_actions = [
        {
          id: "btn-new",
          link: "#",
          class: "fa fa-plus",
          text: "New"
        },
       
      ]
      @items_category_list = ::ItemsCategory.all
      if params[:query].present?
        @items_category_list = @items_category_list.where(
          "name ILIKE :q OR code ILIKE :q",
          q: "%#{params[:query]}%"
        )
      end
    end
  end
end
