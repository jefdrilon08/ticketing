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
      @suppliers_list = ::Supplier.all
      if params[:query].present?
        @suppliers_list = @suppliers_list.where(
          "name ILIKE :q OR code ILIKE :q",
          q: "%#{params[:query]}%"
        )
      end
    end
  end
end
