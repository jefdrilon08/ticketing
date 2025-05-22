module Api
  module V1
    module Administration
      class ItemsController < ActionController::API
        before_action :set_item, only: [:show, :update, :destroy]

        def index
          items = Item.includes(:sub_category).order(:name)
          render json: items.as_json(include: { sub_category: { only: [:id, :name] } })
        end

        def show
          render json: @item.as_json(include: { sub_category: { only: [:id, :name] } })
        end

        def create
          @item = Item.new(item_params)

          assign_sub_category_name(@item)

          if @item.save
            render json: @item, status: :created
          else
            render json: { messages: @item.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def update
          @item.assign_attributes(item_params)

          assign_sub_category_name(@item)

          if @item.save
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
            render json: { messages: ['Item not found.'] }, status: :not_found
          end
        end

        def item_params
          params.require(:item).permit(
            :item_type,
            :items_category_id,
            :sub_category_id,
            :sub_category_name,
            :name,
            :status,
            :unit,
            :description,
            :is_parent,
            :parent_id
          )
        end

        def assign_sub_category_name(item)
          if item.sub_category_id.present?
            sub_cat = SubCategory.find_by(id: item.sub_category_id)
            item.sub_category_name = sub_cat&.name
          else
            item.sub_category_name = nil
          end
        end
      end
    end
  end
end