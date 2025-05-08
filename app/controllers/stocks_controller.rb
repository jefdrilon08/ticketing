class StocksController < ApplicationController
  before_action :set_inventory, only: [:edit, :update, :destroy]
  before_action :load_collections, only: [:new, :create, :edit, :update]

  def index
    @subheader_side_actions = [
      {
        id: "btn-new",
        link: new_inventory_path,
        class: "fa fa-plus",
        text: "New"
      }
    ]
    @inventories = Inventory.all
  end

  def view
    @inventory = Inventory.find_by(id: params[:id])
    return redirect_to(stocks_path, alert: "Inventory not found") if @inventory.nil?

    @brands = Brand.all
    @subheader_side_actions = [
      {
        id: "btn-distribute",
        link: new_distribute_path(inventory_id: @inventory.id),
        class: "fa fa-share",
        text: "Distribute"
      }
    ]

  end

  def new
    @inventory = Inventory.new
    @inventory.data ||= {}
    @inventories = Inventory.all
  end

  def create
    @inventory = Inventory.new(inventory_params_without_virtual_fields)
    @inventory.data = build_inventory_data(params)

    assign_unit_from_item!

    if @inventory.save
      redirect_to stocks_path, notice: "Inventory item added successfully."
    else
      @inventories = Inventory.all
      flash.now[:alert] = "Failed to add inventory item. Please check the form."
      render :new
    end
  end

  def edit
    @inventories = Inventory.all
    render :new
  end

  def update
    @inventory.assign_attributes(inventory_params_without_virtual_fields)
    @inventory.data = build_inventory_data(params)

    assign_unit_from_item!

    if @inventory.save
      redirect_to stocks_path, notice: "Inventory item updated successfully."
    else
      @inventories = Inventory.all
      flash.now[:alert] = "Failed to update inventory item. Please check the form."
      render :edit
    end
  end

  def destroy
    @inventory.destroy
    redirect_to stocks_path, notice: "Inventory item deleted successfully."
  rescue ActiveRecord::InvalidForeignKey
    redirect_to stocks_path, alert: "Unable to delete. This item is already used in another module."
  end

  private

  def set_inventory
    @inventory = Inventory.find(params[:id])
  end

  def load_collections
    @items           = Item.all
    @suppliers       = Supplier.all
    @brands          = Brand.all
    @item_categories = ItemsCategory.all
    @sub_categories  = SubCategory.all
  end

  def inventory_params_without_virtual_fields
    inventory_params.except(:data, :item_category_id, :sub_category_id)
  end

  def inventory_params
    params.require(:inventory).permit(
      :type,
      :supplier_id,
      :item_id,
      :serial_number,
      :unit,
      :quantity,
      :purchase_date,
      :status,
      :item_category_id,
      :sub_category_id,
      data: {
        child_items_attributes: [
          :child_id,
          :child_name,
          :child_brand,
          :child_serial_number,
          :child_quantity,
          :child_item_category_id,
          :child_item_category_name,
          :child_sub_category_id,
          :child_sub_category_name
        ]
      }
    )
  end

  def assign_unit_from_item!
    if params[:inventory][:item_id].present?
      selected = Item.find(params[:inventory][:item_id])
      if selected.item_type.to_s.downcase == 'supply'
        @inventory.unit = selected.unit
        @inventory.serial_number = nil
      else
        @inventory.unit = params[:inventory][:unit]
      end
    else
      @inventory.unit = params[:inventory][:unit]
    end
  end

  def build_inventory_data(params)
    raw_children = params.dig(:inventory, :data, :child_item) || []

    child_items = case raw_children
                  when ActionController::Parameters
                    raw_children.to_unsafe_h.values
                  when Hash
                    raw_children.values
                  when Array
                    raw_children
                  else
                    []
                  end

    formatted_children = child_items.map do |child|
      child = child.to_unsafe_h if child.is_a?(ActionController::Parameters)


      item = Item.find_by(name: child[:child_name])
      item_category = ItemsCategory.find_by(id: child[:child_item_category_id])
      sub_category  = SubCategory.find_by(id: child[:child_sub_category_id])


      child_item_id = item ? item.id : nil

      {
        "child_item_id"            => child_item_id,  
        "child_name"               => child[:child_name],
        "child_brand"              => child[:child_brand],
        "child_serial_number"      => child[:child_serial_number],
        "child_quantity"           => child[:child_quantity],
        "child_item_category_id"   => item_category&.id,
        "child_item_category_name" => item_category&.name,
        "child_sub_category_id"    => sub_category&.id,
        "child_sub_category_name"  => sub_category&.name
      }
    end

    brand         = Brand.find_by(id: params[:inventory][:brand_id])
    item_category = ItemsCategory.find_by(id: params[:inventory][:item_category_id])
    sub_category  = SubCategory.find_by(id: params[:inventory][:sub_category_id])

    inventory_data_hash = {
      "title"              => params[:inventory][:title],
      "brand_id"           => params[:inventory][:brand_id],
      "brand_name"         => brand&.name,
      "model"              => params[:inventory][:model],
      "threshhold_alerts"  => params[:inventory][:threshhold_alerts],
      "reorder_points"     => params[:inventory][:reorder_points],
      "item_category_id"   => params[:inventory][:item_category_id],
      "item_category_name" => item_category&.name,
      "sub_category_id"    => params[:inventory][:sub_category_id],
      "sub_category_name"  => sub_category&.name,
    }

    {
      "inventory_data" => [inventory_data_hash],
      "child_item"     => formatted_children
    }
  end
end
