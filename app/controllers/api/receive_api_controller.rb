module Api
  class ReceiveApiController < ActionController::API
    # API FOR MEMBERS
    
    def save_members_api   
      members = request.body.read

      if members.blank?
        render json: { error: 'Member request body is empty, please fill in.' }, status: 400
      else
        begin
          members = JSON.parse(members)

          if members.nil?
            render json: { error: 'Invalid JSON format' }, status: 400
          else
            errors = ::Kmba::ValidateSaveMembers.new(
              members: members
            ).execute!

            if errors[:full_messages].any?
              render json: { errors: errors[:full_messages] }, status: 400
            else 
              ProcessReceiveMemberApi.perform_later(members)
              render :status => "200", :json => {:Message => "Job Successfully Queued.", :member_count => members.count}
            end   
          end
        rescue JSON::ParserError => e
          render json: { error: 'Invalid JSON format', details: e.message }, status: 400
        end
      end 
    end

    # API FOR PAYMENTS
    def save_payments_api
      payments = request.body.read

      if payments.blank?
        render json: { error: 'Request body is empty' }, status: 400
      else
        begin
          payments = JSON.parse(payments)

          if payments.nil?
            render json: { error: 'Invalid JSON format' }, status: 400
          else
            errors = ::Kmba::ValidateSavePayment.new(
              payments: payments
            ).execute!

            if errors[:full_messages].any?
              render json: { errors: errors[:full_messages] }, status: 400
            else
              ProcessReceivePaymentApi.perform_later(payments)
              render json: { status: '200', message: 'Job Successfully Queued.', payment_count: payments.count }
            end
          end
        rescue JSON::ParserError => e
          render json: { error: 'Invalid JSON format', details: e.message }, status: 400
        end
      end
    end

    # # API FOR CLAIMS
    # def save_claims_api
    #   @claims = []
    #   config = {}
    #   @counter_update = 0

    #   claims = params[:_json]

    #   errors = ::Kmba::ValidateSaveClaims.new(
    #     claims: claims
    #   ).execute!

    #   if errors[:full_messages].any?
    #     render json: errors, status: 400
    #   else
    #     claims.each do |c|
    #       @claims_data = {}
    #       @claims_data[:date_prepared]                      = c[:date_prepared]
    #       @claims_data[:prepared_by]                        = c[:prepared_by]
    #       @claims_data[:created_at]                         = c[:created_at]
    #       @claims_data[:updated_at]                         = c[:updated_at]
    #       @claims_data[:member_id]                          = c[:member_id]
    #       @claims_data[:center_id]                          = c[:center_id]
    #       @claims_data[:branch_id]                          = c[:branch_id]
    #       @claims_data[:claim_type]                         = c[:claim_type]
    #       @claims_data[:data]                               = c[:data]
    #       @claims_data[:status]                             = c[:status]
    #       @claims_data[:approved_by]                        = c[:approved_by]
    #       @claims_data[:checked_by]                         = c[:checked_by]
    #       @claims_data[:date_checked]                       = c[:date_checked]
    #       @claims_data[:date_approved]                      = c[:date_approved]
    #       @claims_data[:posted_by]                          = c[:posted_by]
    #       @claims_data[:date_posted]                        = c[:date_posted]

    #       @claims << @claims_data

    #       config  = @claims.map { |o|
    #         {
    #           date_prepared: o[:date_prepared],
    #           prepared_by: o[:prepared_by],
    #           created_at: o[:created_at],
    #           updated_at: o[:updated_at],
    #           member_id: o[:member_id],
    #           center_id: o[:center_id],
    #           branch_id: o[:branch_id],
    #           claim_type: o[:claim_type],
    #           data: o[:data], 
    #           status: o[:status],
    #           approved_by: o[:approved_by],
    #           checked_by: o[:checked_by],
    #           date_checked: o[:date_checked],
    #           date_approved: o[:date_approved],
    #           posted_by: o[:posted_by],
    #           date_posted: o[:date_posted]
    #         } 
    #       }
    #     end
 
    #     config.each do |a|  
    #       @claims = Claim.where(member_id: a[:member_id])

    #       claims_data = {
    #         date_prepared: a[:date_prepared],
    #         prepared_by: a[:prepared_by],
    #         created_at: a[:created_at],
    #         updated_at: a[:updated_at],
    #         member_id: a[:member_id],
    #         center_id: a[:center_id],
    #         branch_id: a[:branch_id],
    #         claim_type: a[:claim_type],
    #         data: a[:data],
    #         status: a[:status],
    #         approved_by: a[:approved_by],
    #         checked_by: a[:checked_by],
    #         date_checked: a[:date_checked],
    #         date_approved: a[:date_approved],
    #         posted_by: a[:posted_by],
    #         date_posted: a[:date_posted]
    #       }

    #       if @claims.count >= 1
    #         cmd = ::Kmba::UpdateClaims.new(
    #           claims_data: claims_data
    #         ).execute!
    #         @counter_update +=1
    #       end
    #     end
    #   end

    #   if @counter_update > 0
    #     render :status => "200", :json => {:code => "KMBA-003", :Updated => "#{@counter_update}"}.to_json
    #   end  
    # end
  end
end
