class InventoryRequestsController < ApplicationController
  before_action :authenticate_user!
  # before_action :set_inventory_request, only: [:show, :edit, :update, :destroy]

  def index
    @inventory_requests = current_user.inventory_requests.order(created_at: :desc).page(params[:page])
    @inventory_request = InventoryRequest.new
    @subheader_side_actions = [
      {
        id: "btn-create-ticket",
        link: "#newInventoryRequestModal",
        class: "fa fa-plus",
        text: "New Request",
        data: { bs_toggle: "modal" }
      }
    ]
    
  end

  def new
    @inventory_request = InventoryRequest.new(date_request: Date.today)

  end

  def create
    @inventory_request = current_user.inventory_requests.build(inventory_request_params)
    @inventory_request.status = :pending
    
    if @inventory_request.save
      respond_to do |format|
        format.html { redirect_to inventory_request_path(@inventory_request), notice: 'Request created successfully.' }
        format.js   # looks for create.js.erb
      end
    else
      respond_to do |format|
        format.html { render :new }
        format.js   # renders create.js.erb with errors
      end
    end
  end
  
  

  def destroy
    @inventory_request.destroy
    redirect_to inventory_requests_path, notice: 'Inventory request was successfully deleted.'
  end

  def create_inventory_request
    @details = InventoryRequestDetail.new(
      item_id: params[:item_id],
      description: params[:description],
      unit: params[:unit],
      quantity_requested: params[:quantity_requested],
      approve_quantity: params[:approve_quantity],
      remarks: params[:remarks],
      status: params[:status]
    )

    Rails.logger.debug "Creating inventory request with params: #{inventory_request_params.inspect}"
    @inventory_request = InventoryRequest.new(inventory_request_params)
    @inventory_request.user = current_user
    @inventory_request.branch = current_user.branch
  
    if @details.save
      redirect_to "/inventory_requests/#{@inventory_request[id]}/edit"
    else
      flash.now[:alert] = 'There was an error creating the inventory request.'
      redirect_back(fallback_location: inventory_requests_path)
    end
  end

  

# inventory_requests_controller.rb
def show
  @items = Item.all 
  @inventory_request = InventoryRequest.find(params[:id])
  @inventory_request.inventory_request_details

end

  def edit
  end

  def update
    Rails.logger.debug "Received params: #{params.inspect}"
    
    @inventory_request = InventoryRequest.find_by(id: params[:id])
    return redirect_to inventory_requests_path, alert: 'Inventory request not found.' if @inventory_request.nil?
    
    @detail = @inventory_request.inventory_request_details.find_by(id: params[:inventory_request_detail_id])
    return redirect_to @inventory_request, alert: 'Inventory request detail not found.' if @detail.nil?
    
    status = params.dig(:inventory_request, :status)&.strip
    Rails.logger.debug "Status received: #{status}"
    
    valid_statuses = ['pending', 'for checking', 'approved', 'on process', 'for deliver', 'received']
  
    if valid_statuses.include?(status)
      if @detail.update(status: status)
        # After detail update, check if parent inventory request should also update
        update_inventory_request_status(@inventory_request)
        redirect_to @inventory_request, notice: "Inventory request detail status updated to #{status}."
      else
        Rails.logger.debug "Failed to update status. Errors: #{@detail.errors.full_messages.join(', ')}"
        redirect_to @inventory_request, alert: 'Failed to update inventory request detail status.'
      end
    else
      Rails.logger.debug "Invalid status: #{status}"
      redirect_to @inventory_request, alert: 'Invalid status.'
    end
  end
  
  

  
  def destroy
    @inventory_request = InventoryRequest.find_by(id: params[:id])
    if @inventory_request
      @inventory_request.destroy
      redirect_to inventory_requests_path, notice: 'Inventory request was successfully deleted.'
    else
      redirect_to inventory_requests_path, alert: 'Inventory request not found.'
    end
  end
  

  private

  def set_inventory_request
    @inventory_request = InventoryRequest.find(params[:id])
  end

  def inventory_request_params
    params.require(:inventory_request).permit(:date_request, :branch_id, :status)
  end

  def inventory_request_detail_params
    params.require(:inventory_request_detail).permit(:item_id, :description, :unit, :quantity_requested, :approve_quantity, :remarks, :status)
  end
end

def update_inventory_request_status(inventory_request)
  # Example logic: if ALL details are approved, mark the request approved.
  if inventory_request.inventory_request_details.all? { |detail| detail.status == 'approved' }
    inventory_request.update(status: 'approved')
  elsif inventory_request.inventory_request_details.any? { |detail| detail.status == 'for checking' }
    inventory_request.update(status: 'for checking')
  else
    inventory_request.update(status: 'pending')
  end
end
