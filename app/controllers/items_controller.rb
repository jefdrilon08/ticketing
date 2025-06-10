# class ItemsController < ApplicationController
#   def create
#     @item = Item.new(item_params)
#     if @item.save
#       render json: { success: true, item: @item }
#     else
#       render json: { success: false, errors: @item.errors.full_messages }
#     end
#   end

#   private

#   def item_params
#     params.require(:item).permit(
#       :name,
#       :unit,
#       :description,
#       :items_category_id,
#       :sub_category_id,
#       :brand_id,
#       :model,
#       :unit_price,
#       :date_purchased,
#       :status,
#       :is_parent,
#       :parent_id,
#       :item_type,
#       :data,
#       supplier_ids: []
#     )
#   end
# end