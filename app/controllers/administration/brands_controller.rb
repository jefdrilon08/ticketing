module Administration
    class BrandsController < ApplicationController
      before_action :authenticate_user!
  
      def index
        @subheader_side_actions = [
          { id: "btn-new", link: "#", class: "fa fa-plus", text: "New" }
        ]
        @brands_list = ::Brand.all
        if params[:query].present?
          @brands_list = @brands_list.where(
            "name ILIKE :q OR code ILIKE :q",
            q: "%#{params[:query]}%"
          )
        end
        @items       = Item.all.order(:name)   
      end
    end
  end
