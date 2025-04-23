module Api
  module V1
    module Administration
      class ItemsController < ActionController::API
        before_action :set_item, only: [:show, :update, :destroy]

        def index
          items = Item.all.order(:name)
          render json: items
        end

        def show
          @item = Item.find(params[:id])
        end
        
        def create
          @item = Item.new(item_params)

          if @item.is_parent && @item.parent_id.blank?
            render json: { messages: ["Parent Item must be selected when 'Is Parent?' is checked"] }, status: :unprocessable_entity
            return
          end

          if @item.save
            render json: @item, status: :created
          else
            render json: { messages: @item.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def update
          if @item.is_parent && @item.parent_id.blank?
            render json: { messages: ["Parent Item must be selected when 'Is Parent?' is checked"] }, status: :unprocessable_entity
            return
          end

          if @item.update(item_params)
            render json: @item
          else
            render json: { messages: @item.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def destroy
          if @item.destroy
            render json: { message: 'Item deleted successfully.' }, status: :ok
          else
            render json: { messages: ['Error deleting item.'] }, status: :unprocessable_entity
          end
        end

        private

        def set_item
          @item = Item.find_by(id: params[:id])
          unless @item
            render json: { messages: ['Item not found'] }, status: :not_found
          end
        end

        def item_params
          params.require(:item).permit(
            :item_type,
            :items_category_id,
            :name,
            :status,
            :unit,
            :description,
            :is_parent,
            :parent_id
          )
        end
      end
    end
  end
end
