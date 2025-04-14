class ItemRequestController < ApplicationController
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
    render template: "new_item_request/view", layout: true
  end

  def update_status
    @item_request = ItemRequest.find_by(id: params[:id])
    if @item_request.nil?
      render json: { messages: ["Item request not found."] }, status: :not_found and return
    end

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
end
