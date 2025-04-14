class NewItemRequestController < ApplicationController
  before_action :authenticate_user!

  def index
    @item_requests = ItemRequest.where(user: current_user).order(created_at: :desc)
    render template: "new_item_request/index", layout: true
  end

  def new
    @item_request = ItemRequest.new
    @items = Item.all
    @request_supplies = RequestSupply.all
    render template: "new_item_request/view", layout: true
  end

  def create_itemrequest
    @item_request = ItemRequest.new(item_request_params)
    @item_request.user = current_user

    unless Item.exists?(@item_request.item_id)
      @item_request.errors.add(:item_id, "Selected item is invalid.")
    end

    unless Sato.exists?(@item_request.sato_id)
      @item_request.errors.add(:sato_id, "Selected Sato is invalid.")
    end

    if @item_request.save
      redirect_to item_requests_path, notice: "Item Request created successfully."
    else
      flash.now[:alert] = @item_request.errors.full_messages.join(", ")
      render template: "new_item_request/view", layout: true, status: :unprocessable_entity
    end
  end

  def edit
    @item_request = ItemRequest.find(params[:id])
    @items = Item.all
    @request_supplies = RequestSupply.all
    render template: "new_item_request/edit", layout: true
  end

  def update
    @item_request = ItemRequest.find(params[:id])
    if @item_request.update(item_request_params)
      redirect_to details_item_request_path(@item_request), notice: "Item Request updated successfully."
    else
      flash.now[:alert] = @item_request.errors.full_messages.join(", ")
      @items = Item.all
      @request_supplies = RequestSupply.all
      render template: "new_item_request/edit", layout: true, status: :unprocessable_entity
    end
  end

  def show
    @item_request = ItemRequest.find(params[:id])
    @requester_name = @item_request.user.full_name
    @date_request = @item_request.date_request
    render template: "new_item_request/view_details", layout: true
  end

  def add_detail
    @item_request = ItemRequest.find(params[:id])
    @detail = @item_request.item_request_details.new(item_request_detail_params)

    if @detail.save
      redirect_to item_request_details_path(@item_request.id)
    else
      flash.now[:alert] = @detail.errors.full_messages.join(", ")
      render template: "new_item_request/view_details", layout: true, status: :unprocessable_entity
    end
  end

  def details
    @item_request = ItemRequest.find(params[:id])
    @inventory_details = @item_request.inventory_request_details.includes(:item)
    render template: "new_item_request/details", layout: true
  end

  def update_status
    @item_request = ItemRequest.find_by(id: params[:id])
    if @item_request.nil?
      render json: { messages: ["Item request not found."] }, status: :not_found and return
    end

    if params.dig(:item_request, :status).present?
      valid_statuses = ['pending', 'received', 'in_progress', 'completed']
      if valid_statuses.include?(params[:item_request][:status])
        if @item_request.update(status: params[:item_request][:status])
          render json: { message: "Status updated successfully.", new_status: @item_request.status }, status: :ok
        else
          render json: { messages: @item_request.errors.full_messages }, status: :unprocessable_entity
        end
      else
        render json: { messages: ["Invalid status update."] }, status: :unprocessable_entity
      end
    else
      render json: { messages: ["Invalid status update."], status: :unprocessable_entity }
    end
  end

  private

  def item_request_params
    params.require(:item_request).permit(
      :date_request,
      :sato_id,
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

  def item_request_detail_params
    params.require(:item_request_detail).permit(:item_name, :item_id)
  end
end
