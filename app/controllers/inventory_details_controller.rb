class InventoryDetailsController < ApplicationController
    # Display all inventory details
    def index
      @inventory_details = InventoryDetail.all
    end
  
    # Update a single inventory detail
    def update
      @inventory_detail = InventoryDetail.find(params[:id])
  
      if @inventory_detail.update(inventory_detail_params)
        flash[:notice] = "Inventory detail updated successfully!"
        redirect_to inventory_details_path
      else
        flash[:alert] = "Failed to update inventory detail."
        render :index
      end
    end
  
    private
  
    # Strong parameters for updating inventory details
    def inventory_detail_params
      params.require(:inventory_detail).permit(:unit, :quantity_requested, :approved_quantity, :remarks, :status)
    end
  end
  