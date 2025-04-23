class InventoryRequestDetailsController < ApplicationController

  def create
    @inventory_request = InventoryRequest.find(params[:inventory_request_id])
    @detail = @inventory_request.inventory_request_details.new(inventory_request_detail_params)

    if @detail.save
      redirect_to inventory_request_path(@inventory_request), notice: "Detail added successfully."
    else
      redirect_back fallback_location: inventory_requests_path, alert: "Failed to add detail."
    end
  end

  def destroy
    @detail = InventoryRequestDetail.find_by(id: params[:id])
    if @detail
      @detail.destroy
      redirect_to inventory_request_path(@detail.inventory_request_id), notice: 'Detail deleted'
    else
      redirect_back fallback_location: inventory_requests_path, alert: 'Detail not found'
    end
  end
  
  

  private

  def inventory_request_detail_params
    params.require(:inventory_request_detail).permit(:item_id, :description, :unit, :quantity_requested, :approve_quantity, :remarks, :status)
  end
end
