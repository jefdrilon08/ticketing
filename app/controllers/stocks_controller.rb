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
    @items = Item.all
    @suppliers = Supplier.all
  end
  
  def create
    @inventory = Inventory.new(inventory_params)

    if @inventory.save
      redirect_to stocks_path, notice: "Inventory item added successfully."
    else
      @items = Item.all
      @suppliers = Supplier.all
      flash.now[:alert] = "Failed to add inventory item. Please check the form."
      render :new
    end
  end

  def edit
    @inventory = Inventory.find(params[:id])
    @items = Item.all
    @suppliers = Supplier.all
    render :new 
  end
  
  def update
    if @inventory.update(inventory_params)
      redirect_to stocks_path, notice: "Inventory item updated successfully."
    else
      @items = Item.all
      @suppliers = Supplier.all
      flash.now[:alert] = "Failed to update inventory item. Please check the form."
      render :edit
    end
  end

  def destroy
    if @inventory.destroy
      redirect_to stocks_path, notice: "Inventory item deleted successfully."
    else
      redirect_to stocks_path, alert: "Failed to delete inventory item."
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
      :status
    )
  end
end
