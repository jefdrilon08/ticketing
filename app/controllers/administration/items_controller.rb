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
      @item_categories = ::ItemsCategory.order(:name)
      @sub_categories = ::SubCategory.order(:name)

      items = Item.includes(:items_category, :sub_category)

      items = items.where(items_category_id: params[:items_category_id]) if params[:items_category_id].present?
      items = items.where(sub_category_id: params[:sub_category_id]) if params[:sub_category_id].present?
      items = items.where("LOWER(name) LIKE ?", "%#{params[:name].downcase}%") if params[:name].present?
      # items = items.where("LOWER(model) LIKE ?", "%#{params[:model].downcase}%") if params[:model].present?
      items = items.where("LOWER(serial_number) LIKE ?", "%#{params[:serial_number].downcase}%") if params[:serial_number].present?
      items = items.where(date_purchased: params[:date_purchased]) if params[:date_purchased].present?
      items = items.where(status: params[:status]) if params[:status].present?

      @items_list = items
        .order('items_category_id DESC, sub_category_id DESC, name DESC, serial_number DESC, date_purchased DESC, status DESC')
        .page(params[:page])
        .per(25)
    end

    def new
      @item = Item.new
      @items_list = Item.all.sort_by(&:name)
      @item_categories = ::ItemsCategory.all
      @sub_categories = ::SubCategory.all
      @brands = ::Brand.all
    end

    def edit
      @item = Item.find(params[:id])
      @items_list = Item.all.sort_by(&:name)
      @item_categories = ::ItemsCategory.all
      @sub_categories = ::SubCategory.all
      @brands = ::Brand.all
      render :new
    end

    def show
      @subheader_side_actions = [
        {
          id: "btn-distribute",
          link: distribute_administration_item_path,
          class: "fa fa-box",
          text: "Distribute"
        }
      ]
      @item = Item.includes(:items_category, :sub_category).find(params[:id])
    end

    def create
      @item = Item.new(item_params)
      process_suppliers(@item)

      child_details = []
      if params[:item][:data] && params[:item][:data][:child_details].present?
        child_details = JSON.parse(params[:item][:data][:child_details]) rescue []
      end

      @item.data ||= {}
      @item.data["child_details"] = child_details

      if @item.save
        redirect_to administration_items_path, notice: 'Item created successfully.'
      else
        @items_list = Item.all.sort_by(&:name)
        @item_categories = ::ItemsCategory.all
        @sub_categories = ::SubCategory.all
        @brands = ::Brand.all
        render :new
      end
    end

    def update
      @item = Item.find(params[:id])
      @item.assign_attributes(item_params)
      process_suppliers(@item)

      child_details = []
      if params[:item][:data] && params[:item][:data][:child_details].present?
        begin
          child_details = JSON.parse(params[:item][:data][:child_details])
        rescue
          child_details = []
        end
      end
      @item.data ||= {}
      @item.data["child_details"] = child_details

      if @item.save
        redirect_to administration_items_path, notice: 'Item updated successfully.'
      else
        @items_list = Item.all.sort_by(&:name)
        @item_categories = ::ItemsCategory.all
        @sub_categories = ::SubCategory.all
        @brands = ::Brand.all
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

  def distribute
    @item = Item.includes(:items_category, :sub_category).find(params[:id])
  end

    private

  def item_params
    params.require(:item).permit(
      :item_type,
      :items_category_id,
      :sub_category_id,
      :name,
      :status,
      :unit,
      :description,
      :is_parent,
      :parent_id,
      :brand_id,
      :model,
      :serial_number,
      :date_purchased,
      :unit_price,
      data: {}
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
  end
end