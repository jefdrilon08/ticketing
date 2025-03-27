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
    rendered_partial = render_to_string(
      partial: "details",
      locals: { item_request: @item_request, detail: @detail }
    )
    render inline: rendered_partial, layout: true
  end

  def update_status
    # Rails.logger.debug "Params received: #{params.inspect}"
    @detail = ItemRequestDetail.find_by(id: params[:id])
    # Rails.logger.debug "Found detail: #{@detail.inspect}"
    if @detail.nil?
      render json: { messages: ["Item request detail not found."] }, status: :not_found and return
    end

    if params.dig(:item_request_detail, :status).present?
      if @detail.update(status: params[:item_request_detail][:status])
        # Rails.logger.debug "Detail updated: #{@detail.inspect}"
        render json: { message: "Status updated successfully.", new_status: @detail.status }, status: :ok
      else
        render json: { messages: @detail.errors.full_messages }, status: :unprocessable_entity
      end
    else
      render json: { messages: ["Invalid status update."] }, status: :unprocessable_entity
    end
  end
end
