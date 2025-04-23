class StocksController < ApplicationController
  before_action :set_inventory, only: [:edit, :update, :destroy]

  def index
    @subheader_side_actions = [
      {
        id: "btn-new",
        link: new_inventory_path,
        class: "fa fa-plus",
        text: "New"
      }
    ]
    @inventories = Inventory.all || []
  end

  def view
    @inventory = Inventory.find_by(id: params[:id])
    @brands = Brand.all

    if @inventory.nil?
      redirect_to stocks_path, alert: "Inventory not found"
      return
    end

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
    @items = Item.all
    @suppliers = Supplier.all
    @brands = Brand.all
  end

  def create
    @inventory = Inventory.new(inventory_params)

    @inventory.data = {
      "title" => params[:inventory][:title],
      "brand_id" => params[:inventory][:brand_id],
      "model" => params[:inventory][:model],
      "threshhold_alerts" => params[:inventory][:threshhold_alerts],
      "reorder_points" => params[:inventory][:reorder_points]
    }


    if params[:inventory][:item_id].present?
      selected_item = Item.find(params[:inventory][:item_id])
      if selected_item.item_type == 'supply'
        @inventory.unit = selected_item.unit
      else
        @inventory.unit = params[:inventory][:unit]
      end
    else
      @inventory.unit = params[:inventory][:unit]
    end

    if @inventory.save
      redirect_to stocks_path, notice: "Inventory item added successfully."
    else
      @items = Item.all
      @suppliers = Supplier.all
      @brands = Brand.all
      flash.now[:alert] = "Failed to add inventory item. Please check the form."
      render :new
    end
  end

  def edit
    @items = Item.all
    @suppliers = Supplier.all
    @brands = Brand.all
    render :new
  end

  def update
    @inventory.data = {
      "title" => params[:inventory][:title],
      "brand_id" => params[:inventory][:brand_id],
      "model" => params[:inventory][:model],
      "threshhold_alerts" => params[:inventory][:threshhold_alerts],
      "reorder_points" => params[:inventory][:reorder_points]
    }

    if params[:inventory][:item_id].present?
      selected_item = Item.find(params[:inventory][:item_id])
      if selected_item.item_type == 'supply'
        @inventory.unit = selected_item.unit
      else
        @inventory.unit = params[:inventory][:unit]
      end
    else
      @inventory.unit = params[:inventory][:unit]
    end

    if @inventory.update(inventory_params)
      redirect_to stocks_path, notice: "Inventory item updated successfully."
    else
      @items = Item.all
      @suppliers = Supplier.all
      @brands = Brand.all
      flash.now[:alert] = "Failed to update inventory item. Please check the form."
      render :edit
    end
  end

  def destroy
    begin
      if @inventory.destroy
        redirect_to stocks_path, notice: "Inventory item deleted successfully."
      else
        redirect_to stocks_path, alert: "Failed to delete inventory item."
      end
    rescue ActiveRecord::InvalidForeignKey
      redirect_to stocks_path, alert: "Unable to delete. This item is already used in another module."
    end
  end

  private

  def set_inventory
    @inventory = Inventory.find(params[:id])
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
      :data
    )
  end
end
