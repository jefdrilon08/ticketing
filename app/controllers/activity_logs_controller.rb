class ActivityLogsController < ApplicationController
  before_action :authenticate_user!

  def index
    @activity_logs = ReadOnlyActivityLog.select("*")

    if params[:q].present?
      @q = params[:q]
      @activity_logs = @activity_logs.where("lower(content) LIKE :q", q: "%#{@q.downcase}%")
    end

    if params[:user_id].present?
      @user_id = params[:user_id]
      @activity_logs = @activity_logs.where("data ->> 'user_id' = ?", @user_id)
    end

    if params[:start_date].present? and params[:end_date].present?
      @start_date = params[:start_date]
      @end_date   = params[:end_date]

      # @activity_logs  = @activity_logs.where("DATE(created_at) >= ? AND DATE(created_at) <= ?", @start_date, @end_date)
      @activity_logs  = @activity_logs.where("Date(activity_logs.created_at) BETWEEN ? AND ?", @start_date, @end_date)
    end

    @activity_logs = @activity_logs.page(params[:page]).per(LIST_PAGE_SIZE).order("created_at DESC")

    @subheader_items = [
      { text: "Activity Logs" }
    ]
  end
end
