class InventoryRequestDetailsController < ApplicationController
  
  def show
    @inventory_request = InventoryRequest.find(params[:id])
    @inventory_request_details = @inventory_request.inventory_request_details
  end

  def create
    @inventory_request = InventoryRequest.find(params[:inventory_request_id])

    # Prepare the data for storing in the JSON column
    data = {
      user_id: params[:inventory_request][:data][:user_id],
      cluster_id: params[:inventory_request][:data][:cluster_id],
      branch_id: params[:inventory_request][:data][:branch_id],
      item_category_id: params[:inventory_request][:data][:item_category_id]
    }

    # Ensure the data field exists (initialize if nil)
    @inventory_request.data ||= {}

    # Merge the new data into the existing 'data' field
    @inventory_request.data.merge!(data)

    # Now add the new inventory request detail to the inventory_details array
    detail = {
      item_id: params[:inventory_request_detail][:item_id],
      unit: params[:inventory_request_detail][:unit],
      quantity_requested: params[:inventory_request_detail][:quantity_requested],
      remarks: params[:inventory_request_detail][:remarks],
      category_name: ItemsCategory.find(params[:inventory_request][:data][:item_category_id]).try(:name),
      cluster_name: Cluster.find(params[:inventory_request][:data][:cluster_id]).try(:name),
      user_full_name: User.find(params[:inventory_request][:data][:user_id]).try(:full_name),
      branch_name: Branch.find(params[:inventory_request][:data][:branch_id]).try(:name),
      item_category_id: params[:inventory_request][:data][:item_category_id],
      cluster_id: params[:inventory_request][:data][:cluster_id],
      user_id: params[:inventory_request][:data][:user_id],
      branch_id: params[:inventory_request][:data][:branch_id]
}


    # Ensure inventory_details exists in the data field
    @inventory_request.data['inventory_details'] ||= []
    @inventory_request.data['inventory_details'] << detail

    # Save the updated inventory request
    if @inventory_request.save
      redirect_to @inventory_request, notice: 'Inventory request detail added successfully.'
    else
      render :new
    end
  end

  def update
    puts "Params: #{params.inspect}"
    @inventory_request_detail = InventoryRequestDetail.find(params[:id])
    if @inventory_request_detail.update(inventory_request_detail_params)
      redirect_to inventory_request_path(@inventory_request_detail.inventory_request_id), notice: 'Detail was successfully updated.'
    else
      render :edit
    end
  end
  
  def edit
    @inventory_request = InventoryRequest.find(params[:inventory_request_id])
    @inventory_request_detail = InventoryRequestDetail.find(params[:id])
    render json: @inventory_request_detail
  end

  def destroy
    @inventory_request = InventoryRequest.find(params[:inventory_request_id])
    details = @inventory_request.data['inventory_details'] || []

    index = params[:index].to_i

    if details[index]
      details.delete_at(index)
      @inventory_request.data['inventory_details'] = details
      if @inventory_request.save
        redirect_to @inventory_request, notice: 'Inventory request detail deleted successfully.'
      else
        redirect_to @inventory_request, alert: 'Failed to delete detail.'
      end
    else
      redirect_to @inventory_request, alert: 'Detail not found.'
    end
  end

  def destroy_json_detail
    @inventory_request = InventoryRequest.find(params[:inventory_request_id])
    index = params[:index].to_i

    if @inventory_request.data && @inventory_request.data['inventory_details']
      @inventory_request.data['inventory_details'].delete_at(index)

      if @inventory_request.save
        redirect_to @inventory_request, notice: "Detail was successfully deleted."
      else
        redirect_to @inventory_request, alert: "Failed to delete detail."
      end
    else
      redirect_to @inventory_request, alert: "No details found."
    end
  end

  private

  # def set_inventory_request_detail
  #   Rails.logger.debug "Edit clicked"
  #   @inventory_request_detail = InventoryRequestDetail.find(params[:id])
  #   Rails.logger.debug "@inventory_request_detail: #{@inventory_request_detail.inspect}"
  # end

  def inventory_request_detail_params
    params.require(:inventory_request_detail).permit(
      :item_id,
      :description,
      :unit,
      :quantity_requested,
      :approve_quantity,
      :remarks,
      :status,
      :item_category_id,
      :cluster_id,
      :user_id,    # Add user_id to permit the new field
      :branch_id   # Add branch_id to permit the new field
    )
  end
end
