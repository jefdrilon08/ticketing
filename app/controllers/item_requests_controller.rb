class ItemRequestsController < ApplicationController
  def index
    @item_requests = ItemRequest.all
    @subheader_side_actions = [
      {
        id: "btn-new",
        link: new_item_request_path,
        class: "fa fa-plus",
        text: "New"
      }
    ]
  end

  def new
    @item_request = ItemRequest.new
    @items = Item.all.presence || []
    @request_supplies = RequestSupply.all
    logger.debug(@items.inspect)
  end

  def create
    @item_request = ItemRequest.new(item_request_params)

    unless Item.exists?(item_request_params[:item_id])
      flash[:error] = "Selected item is invalid."
      return render :new
    end

    unless Sato.exists?(item_request_params[:sato_id])
      flash[:error] = "Selected Sato is invalid."
      return render :new
    end

    if @item_request.save
      flash[:notice] = "Item request created successfully."
      redirect_to item_requests_path
    else
      flash[:error] = @item_request.errors.full_messages.join(", ")
      render :new
    end
  end

  def update_status
    @item_request = ItemRequest.find_by(id: params[:id])
    return render json: { messages: ["Item request not found."] }, status: :not_found unless @item_request

    if params.dig(:item_request, :status).present?
      if @item_request.update(status: params[:item_request][:status])
        render json: { message: "Status updated successfully.", new_status: @item_request.status }, status: :ok
      else
        render json: { messages: @item_request.errors.full_messages }, status: :unprocessable_entity
      end
    else
      render json: { messages: ["Invalid status update."] }, status: :unprocessable_entity
    end
  end

  def destroy
    @item_request = ItemRequest.find_by(id: params[:id])

    if @item_request.nil?
      flash[:alert] = "Item request not found."
    else
      @item_request.destroy
      flash[:notice] = "Item request deleted successfully."
    end

    redirect_to item_requests_path
  end

  def details
    @item_request = ItemRequest.find_by(id: params[:id])
    return redirect_to item_requests_path, alert: "Item request not found." unless @item_request

    @inventory_details = @item_request.inventory_request_details
  end

  private

  def item_request_params
    params.require(:item_request).permit(:date_request, :sato_id, :request_supply_id, :item_id, :description)
  end
end
