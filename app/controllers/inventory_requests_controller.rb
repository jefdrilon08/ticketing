class InventoryRequestsController < ApplicationController
  before_action :authenticate_user!

  def index
    @inventory_requests = current_user.inventory_requests.order(created_at: :desc).page(params[:page])
    @inventory_requests = InventoryRequest.includes(:branch, :request_to, :user).all
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

  @subheader_side_actions = []

  unless @inventory_request.status == "received"
    @subheader_side_actions << {
      id: "btn-change-status",
      link: "#",
      class: "btn btn-sm shadow-sm",
      text: status_button_text(@inventory_request.status),
      data: { 
        method: "patch", 
        url: update_inventory_request_status_path(@inventory_request.id)
      }
    }
  end
end


def update_status
  @inventory_request = InventoryRequest.find(params[:id])

  new_status = case @inventory_request.status
               when "pending" then "for checking"
               when "for_checking" then "checked"
               when "checked" then "approve"
               when "approve" then "on process"
               when "on_process" then "for delivery"
               when "for_delivery" then "received"
               else @inventory_request.status
               end

  # Track status change
  log_entry = {
    status: new_status,
    updated_by: current_user.id,
    updated_at: Time.current
  }

  # Append to data['status_logs'] array
  logs = @inventory_request.data&.dig("status_logs") || []
  logs << log_entry

  new_data = @inventory_request.data || {}
  new_data["status_logs"] = logs

  if @inventory_request.update(status: new_status, data: new_data)
    redirect_to @inventory_request, notice: "Status updated to #{new_status.titleize}."
  else
    redirect_to @inventory_request, alert: "Failed to update status."
  end
end


  def edit
  end
  

  def update
    Rails.logger.debug "Received params: #{params.inspect}"
    
    @inventory_request = InventoryRequest.find_by(id: params[:id])
    return redirect_to inventory_requests_path, alert: 'Inventory request not found.' if @inventory_request.nil?
    
    # Only updating the inventory request status, no need for details
    status = params.dig(:inventory_request, :status)&.strip
    Rails.logger.debug "Status received: #{status}"
  
    valid_statuses = ['pending', 'for checking', 'approve', 'on process', 'for delivery', 'done']
  
    if valid_statuses.include?(status)
      if @inventory_request.update(status: status)
        # After updating the request status, you might want to trigger status update for details if necessary
        update_inventory_request_status(@inventory_request)
        redirect_to @inventory_request, notice: "Inventory request status updated to #{status.titleize}."
      else
        Rails.logger.debug "Failed to update status. Errors: #{@inventory_request.errors.full_messages.join(', ')}"
        redirect_to @inventory_request, alert: 'Failed to update inventory request status.'
      end
    else
      Rails.logger.debug "Invalid status: #{status}"
      redirect_to @inventory_request, alert: 'Invalid status.'
    end
  end

  def update_request_from
    @inventory_request = InventoryRequest.find(params[:id])
  
    if @inventory_request.update(branch_id: params[:branch_id])
      redirect_to @inventory_request, notice: "Request From updated."
    else
      redirect_to @inventory_request, alert: "Failed to update Request From."
    end
  end
  
  
  def update_request_to
    @inventory_request = InventoryRequest.find(params[:id])
  
    if @inventory_request.update(request_to_id: params[:request_to_id])
      redirect_to @inventory_request, notice: "Request To updated."
    else
      redirect_to @inventory_request, alert: "Failed to update Request To."
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
    params.require(:inventory_request).permit(:date_request, :branch_id, :status, :request_to_id)
  end

  def inventory_request_detail_params
    params.require(:inventory_request_detail).permit(:item_id, :description, :unit, :quantity_requested, :approve_quantity, :remarks, :status)
  end
end

def update_inventory_request_status(inventory_request)
  if inventory_request.inventory_request_details.all? { |detail| detail.status == 'approved' }
    inventory_request.update(status: 'approved')
  elsif inventory_request.inventory_request_details.any? { |detail| detail.status == 'for checking' }
    inventory_request.update(status: 'for checking')
  else
    inventory_request.update(status: 'pending')
  end
end

def status_button_text(status)
  case status
  when "pending"
    "For Checking"
  when "for_checking"
    "Checked"
  when "checked"
    "Approve"
  when "approve"
    "On Process"
  when "on_process"
    "For Delivery"
  when "for_delivery"
    "Received"
  else
    "Unknown Status"
  end
end



