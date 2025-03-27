# app/controllers/new_item_request_controller.rb
class NewItemRequestController < ApplicationController
  before_action :authenticate_user!

  # Renders the initial form to create a new ItemRequest.
  def new
    @item_request = ItemRequest.new(date_request: Date.today)
    requested_user_ids = ItemRequest.pluck(:user_id)
    @available_users = User.where.not(id: requested_user_ids)
    @items = Item.all  # Load items for the dropdown (if needed in this view)
    render template: "new_item_request/view", layout: true
  end

  # Creates the main ItemRequest record.
  def create_itemrequest
    @item_request = ItemRequest.new(item_request_params)
    @item_request.status = "Pending"

    if @item_request.save
      # After saving, redirect to the index view of item requests.
      redirect_to item_request_index_path
    else
      Rails.logger.debug "Item Request creation failed: #{@item_request.errors.full_messages.join(', ')}"
      flash.now[:alert] = @item_request.errors.full_messages.join(", ")
      requested_user_ids = ItemRequest.pluck(:user_id)
      @available_users = User.where.not(id: requested_user_ids)
      render template: "new_item_request/view", layout: true, status: :unprocessable_entity
    end
  end

  # Renders the details form for a specific ItemRequest.
  def view_details
    @item_request = ItemRequest.find(params[:id])
    @requester_name = @item_request.user.full_name
    @date_request   = @item_request.date_request
    @items = Item.all  # Load all items for the dropdown
    render template: "new_item_request/view_details", layout: true
  end

  # Creates a new ItemRequestDetail record (always inserts a new record)
  def create_itemrequest_detail
    @item_request = ItemRequest.find(params[:id])
    @detail = @item_request.item_request_details.new(
      item_id: params[:item_id],  # The UUID of the selected Item
      qty:     params[:qty]
    )

    if @detail.save
      # Redirect to the index view of item request details.
      redirect_to item_request_details_path(@item_request.id)
    else
      flash.now[:alert] = @detail.errors.full_messages.join(", ")
      @requester_name = @item_request.user.full_name
      @date_request   = @item_request.date_request
      @items = Item.all
      render template: "new_item_request/view_details", layout: true, status: :unprocessable_entity
    end
  end

  private

  def item_request_params
    params.require(:item_request).permit(:user_id, :date_request)
  end
end
