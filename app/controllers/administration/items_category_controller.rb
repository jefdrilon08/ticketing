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
      @items_category_list = ::ItemsCategory.all.sort_by(&:name)
    end
  end
end
