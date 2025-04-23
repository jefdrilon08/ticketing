class InventoryRequestsController < ApplicationController
  before_action :authenticate_user!
  # before_action :set_inventory_request, only: [:show, :edit, :update, :destroy]

  def index
    @inventory_requests = current_user.inventory_requests.order(created_at: :desc).page(params[:page])
    @subheader_side_actions = [
      {
        id: "btn-create-ticket",
        link: new_inventory_request_path,
        class: "fa fa-plus",
        text: "New Request"
      }
    ]
  end

  def new
    @inventory_request = InventoryRequest.new(date_request: Date.today)

  end

  def create
    @inventory_request = current_user.inventory_requests.new(inventory_request_params)
    if @inventory_request.save
      redirect_to inventory_requests_path, notice: 'Inventory request was successfully created.'
    else
      flash.now[:alert] = 'There was an error creating the request.'
      render :new
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
  @subheader_side_actions = [
    {
      id: "btn-create-request",
      link: "#",
      class: "fa fa-plus",
      text: "Add Details",
    }
  ]  
end

  def edit
  end

  def update
    if @inventory_request.update(inventory_request_params)
      redirect_to inventory_request_path(@inventory_request), notice: 'Inventory request was successfully updated.'
    else
      flash.now[:alert] = 'There was an error updating the request.'
      render :edit
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
