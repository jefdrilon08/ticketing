module Administration
  class ItemsController < ApplicationController
    before_action :authenticate_user!

    def index
      @subheader_side_actions = [
        {
          id: "btn-new",
          link: new_administration_item_path,
          class: "fa fa-plus",
          text: "New"
        }
      ]
      @items_list = Item.includes(:items_category, :sub_category).all.sort_by(&:name)
    end

    def new
      @item = Item.new
      @items_list = Item.all.sort_by(&:name)
      logger.debug("Rendering new item form")
    end

    def edit
      @item = Item.find(params[:id])
      @items_list = Item.all.sort_by(&:name)
      render :new
    end

    def show
      @item = Item.includes(:items_category, :sub_category).find(params[:id])
    end

    def create
      @item = Item.new(item_params)

      assign_sub_category_name(@item)
      process_suppliers(@item)

      logger.debug("Creating new item with params: #{item_params.inspect}")

      if @item.save
        redirect_to administration_items_path, notice: 'Item created successfully.'
      else
        @items_list = Item.all.sort_by(&:name)
        render :new
      end
    end

    def update
      @item = Item.find(params[:id])
      @item.assign_attributes(item_params)

      assign_sub_category_name(@item)
      process_suppliers(@item)

      if @item.save
        redirect_to administration_items_path, notice: 'Item updated successfully.'
      else
        @items_list = Item.all.sort_by(&:name)
        render :new
      end
    end

    def destroy
      @item = Item.find(params[:id])

      if @item.destroy
        render json: { message: 'Item deleted successfully.' }, status: :ok
      else
        render json: { messages: ['Error deleting item.'] }, status: :unprocessable_entity
      end
    rescue ActiveRecord::InvalidForeignKey, ActiveRecord::DeleteRestrictionError
      render json: {
        messages: ['Unable to delete. This item is being used as a Parent Item.']
      }, status: :unprocessable_entity
    end

    private

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

    def process_suppliers(item)
      if params[:item][:supplier_ids].present?
        item.data ||= {}
        supplier_ids = Array(params[:item][:supplier_ids])
        item.data["supplier_ids"] = supplier_ids
        item.data["supplier_names"] = Supplier.where(id: supplier_ids).pluck(:name)
      end
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