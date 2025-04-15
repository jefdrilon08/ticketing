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
        },
      ]
      @items_list = Item.all.sort_by(&:name)
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
      @item = Item.find(params[:id])
    end
   

    def create
      @item = Item.new(item_params)

      if params[:item][:supplier_id].present?
        supplier = Supplier.find_by(id: params[:item][:supplier_id])
        if supplier
          @item.data = {
            "supplier" => {
              "supplier_id" => supplier.id,
              "name" => supplier.name
            }
          }
        end
      end

      logger.debug("Creating new item with params: #{item_params.inspect}")

      if @item.is_parent && @item.parent_id.blank?
        @item.errors.add(:parent_id, "must be selected when 'Is Parent?' is checked")
      end

      if @item.save
        redirect_to administration_items_path, notice: 'Item created successfully.'
      else
        @items_list = Item.all.sort_by(&:name)
        render :new
      end
    end

    def update
      @item = Item.find(params[:id])

      if @item.is_parent && @item.parent_id.blank?
        @item.errors.add(:parent_id, "must be selected when 'Is Parent?' is checked")
      end

      if @item.update(item_params)

        if params[:item][:supplier_id].present?
          supplier = Supplier.find_by(id: params[:item][:supplier_id])
          if supplier
            @item.update(data: {
              "supplier" => {
                "supplier_id" => supplier.id,
                "supplier_name" => supplier.name
              }
            })
          end
        end

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
        :name,
        :status,
        :unit,
        :description,
        :is_parent,
        :parent_id,
      )
    end
  end
end
