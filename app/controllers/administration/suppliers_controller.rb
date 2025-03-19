module Administration
  class SuppliersController < ApplicationController
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
      @suppliers_list = ::Supplier.all.sort_by(&:name)
    end
  end
end
