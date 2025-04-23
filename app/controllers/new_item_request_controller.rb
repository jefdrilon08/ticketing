class NewItemRequestController < ApplicationController
  before_action :authenticate_user!
  before_action :set_inventory_request, only: [:edit, :update, :show, :add_detail, :details, :update_status]


  def index
    @inventory_requests = InventoryRequest.where(user: current_user).order(created_at: :desc).page(params[:page])
    render template: "new_item_request/index", layout: true
  end

  def new
    @inventory_request = InventoryRequest.new
    render template: "new_item_request/view", layout: true
  end

  def create_inventory_request
    @inventory_request = InventoryRequest.new(inventory_request_params)
    @inventory_request.user = current_user

    # Validation in the model can handle this logic as well
    @inventory_request.errors.add(:item_id, "Selected item is invalid.") unless Item.exists?(@inventory_request.item_id)
    @inventory_request.errors.add(:sato_id, "Selected Sato is invalid.") unless Sato.exists?(@inventory_request.sato_id)

    if @inventory_request.errors.any?
      flash.now[:alert] = @inventory_request.errors.full_messages.join(", ")
      render template: "new_item_request/view", layout: true, status: :unprocessable_entity
    elsif @inventory_request.save
      redirect_to inventory_request_path, notice: "Inventory Request created successfully."
    else
      flash.now[:alert] = @inventory_request.errors.full_messages.join(", ")
      render template: "new_item_request/view", layout: true, status: :unprocessable_entity
    end
  end

  def edit
    render template: "new_item_request/edit", layout: true
  end

  def update
    if @inventory_request.update(inventory_request_params)
      redirect_to details_inventory_request_path(@inventory_request), notice: "Inventory Request updated successfully."
    else
      flash.now[:alert] = @inventory_request.errors.full_messages.join(", ")
      render template: "new_item_request/edit", layout: true, status: :unprocessable_entity
    end
  end

  def show
    @requester_name = @inventory_request.user.full_name
    @date_request = @inventory_request.date_request
    render template: "new_item_request/view_details", layout: true
  end

  def add_detail
    @detail = @inventory_request.inventory_request_details.new(inventory_request_detail_params)

    if @detail.save
      redirect_to inventory_request_details_path(@inventory_request.id)
    else
      flash.now[:alert] = @detail.errors.full_messages.join(", ")
      render template: "new_item_request/details", layout: true, status: :unprocessable_entity
    end
  end

  def details
    @inventory_details = @inventory_request.inventory_request_details.includes(:item)
    render template: "new_item_request/details", layout: true
  end

  def update_status
    unless @inventory_request
      render json: { messages: ["Inventory request not found."] }, status: :not_found and return
    end

    status_param = params.dig(:inventory_request, :status)
    valid_statuses = ['pending', 'received', 'in_progress', 'completed']

    if status_param.present? && valid_statuses.include?(status_param)
      if @inventory_request.update(status: status_param)
        render json: { message: "Status updated successfully.", new_status: @inventory_request.status }, status: :ok
      else
        render json: { messages: @inventory_request.errors.full_messages }, status: :unprocessable_entity
      end
    else
      render json: { messages: ["Invalid status update."] }, status: :unprocessable_entity
    end
  end

  private

  def inventory_request_params
    params.require(:inventory_request).permit(
      :date_request,
      :branch_id,
      :status,
      :request_supply_id,
      :item_id,
      :item_name,
      :description,
      :unit,
      :quantity_requested,
      :approve_quantity,
      :remarks
    )
  end

  def inventory_request_detail_params
    params.require(:inventory_request_detail).permit(:item_name, :item_id, :quantity, :description)
  end

  def set_inventory_request
    @inventory_request = InventoryRequest.find_by(id: params[:id])
  end

end
