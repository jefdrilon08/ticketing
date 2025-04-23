module Administration
    class BrandsController < ApplicationController
      before_action :authenticate_user!
  
      def index
        @subheader_side_actions = [
          { id: "btn-new", link: "#", class: "fa fa-plus", text: "New" }
        ]
        @brands_list = ::Brands.all.order(:name)
        @items       = Item.all.order(:name)   
      end
    end
  end
  