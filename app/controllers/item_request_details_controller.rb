class ItemRequestDetailsController < ApplicationController
  before_action :authenticate_user!

  def index
    @item_request = ItemRequest.find(params[:id])
    @subheader_side_actions = [
      {
        id: "btn-new",
        link: new_item_request_details_path(@item_request.id),
        class: "fa fa-plus",
        text: "New"
      }
    ]
    render template: "item_request_details/index", layout: true
  end

  def details
    @detail = ItemRequestDetail.find(params[:id])
    @item_request = @detail.item_request
    render :details, layout: true
  end

  def update_status
    @detail = ItemRequestDetail.find_by(id: params[:id])
    if @detail.nil?
      render json: { messages: ["Item request detail not found."] }, status: :not_found and return
    end

    if params.dig(:item_request_detail, :status).present?
      if @detail.update(status: params[:item_request_detail][:status])
        render json: { message: "Status updated successfully.", new_status: @detail.status }, status: :ok
      else
        render json: { messages: @detail.errors.full_messages }, status: :unprocessable_entity
      end
    else
      render json: { messages: ["Invalid status update."] }, status: :unprocessable_entity
    end
  end
end
