class ReportsController < ApplicationController

  def index
    @concern_tickets = ConcernTicket.order(:name)
    render 'concern_tickets/reports/reports'
  end

  def reports
  load_data_store_records
  @concern_tickets = ConcernTicket.order(:name)
  @concern_fors = load_concern_fors(@records)

  render 'concern_tickets/reports/reports'
  end

  STATUS_MAP = {
    "open" => "Open",
    "processing" => "Processing",
    "hold" => "Hold",
    "for verification" => "For Verification",
    "verification" => "For Verification",  
    "closed" => "Closed"
  }

  def concern_tickets
  load_data_store_records
  @concern_tickets = ConcernTicket.order(:name)
  @concern_name_options = ConcernTicket.distinct.order(:name).pluck(:name, :id)

  render 'concern_tickets/reports/reports'
  end

  def view_report_by_data_store
  @data_store = DataStore.find(params[:id])
  
  # Extract concern_ticket_id from the stored data
  ticket_id = @data_store.data["concern_ticket_id"]

  # Find the ConcernTicket record
  @concern_ticket = ConcernTicket.find_by(id: ticket_id)

  build_report_data(@data_store)
  @concern_fors = load_concern_fors([@data_store])

  render 'concern_tickets/reports/view_report'
  end


  def create_data_store
  permitted = data_store_params
  start_date = parse_date(permitted[:start_date])
  end_date = parse_date(permitted[:end_date])
  start_date, end_date = end_date, start_date if start_date && end_date && start_date > end_date

  details = ConcernTicketDetail.where(concern_ticket_id: permitted[:concern_ticket_id])
  if start_date && end_date
    details = details.where(created_at: start_date.beginning_of_day..end_date.end_of_day)
  elsif start_date
    details = details.where("created_at >= ?", start_date.beginning_of_day)
  elsif end_date
    details = details.where("created_at <= ?", end_date.end_of_day)
  end

  concern_ticket_ids = details.pluck(:concern_ticket_id).uniq
  assigned_user_ids = details.pluck(:assigned_user_id).compact.uniq

  developer_ctus = ConcernTicketUser.where(
    concern_ticket_id: concern_ticket_ids,
    user_id: assigned_user_ids
  ).where("LOWER(TRIM(task)) LIKE ?", "%developer%")

  developer_map = developer_ctus.each_with_object({}) do |ctu, map|
    map[[ctu.concern_ticket_id, ctu.user_id]] = true
  end

  serialized_details = details.map do |detail|
    assigned_is_dev = developer_map[[detail.concern_ticket_id, detail.assigned_user_id]] || false

    {
      id: detail.id,
      ticket_number: detail.ticket_number,
      description: detail.description,
      status: detail.status,
      branch_id: detail.branch_id,
      requested_user_id: detail.requested_user_id,
      concern_type_id: detail.concern_type_id,
      assigned_user_id: detail.assigned_user_id,
      assigned_user_is_developer: assigned_is_dev,
      created_at: detail.created_at,
      updated_at: detail.updated_at,
      name_for_id: detail.name_for_id.to_s,
      concern_ticket_id: detail.concern_ticket_id.to_s,
      data: detail.data
    }
  end

  @data_store = DataStore.new(
    data: {
      concern_ticket_id: permitted[:concern_ticket_id].to_s,
      start_date: permitted[:start_date],
      end_date: permitted[:end_date],
      concern_ticket_details: serialized_details
    },
    status: "active",
    start_date: permitted[:start_date],
    end_date: permitted[:end_date]
  )

  if @data_store.save
    redirect_to view_report_by_data_store_path(@data_store.id), notice: "DataStore created successfully."
  else
    flash[:alert] = "Failed to create DataStore."
    redirect_to reports_concern_tickets_path
  end
  end

  def filter
    permitted = data_store_params
    start_date = parse_date(permitted[:start_date])
    end_date = parse_date(permitted[:end_date])
    start_date, end_date = end_date, start_date if start_date && end_date && start_date > end_date

    details = ConcernTicketDetail.where(concern_ticket_id: permitted[:concern_ticket_id])
    if start_date && end_date
      details = details.where(created_at: start_date.beginning_of_day..end_date.end_of_day)
    elsif start_date
      details = details.where("created_at >= ?", start_date.beginning_of_day)
    elsif end_date
      details = details.where("created_at <= ?", end_date.end_of_day)
    end

    concern_ticket_ids = details.pluck(:concern_ticket_id).uniq
    assigned_user_ids = details.pluck(:assigned_user_id).compact.uniq

    developer_ctus = ConcernTicketUser.where(
      concern_ticket_id: concern_ticket_ids,
      user_id: assigned_user_ids
    ).where("LOWER(TRIM(task)) LIKE ?", "%developer%")

    developer_map = developer_ctus.each_with_object({}) do |ctu, map|
      map[[ctu.concern_ticket_id, ctu.user_id]] = true
  end

  serialized_details = details.map do |detail|
    assigned_is_dev = developer_map[[detail.concern_ticket_id, detail.assigned_user_id]] || false

    {
      id: detail.id,
      ticket_number: detail.ticket_number,
      description: detail.description,
      status: detail.status,
      branch_id: detail.branch_id,
      requested_user_id: detail.requested_user_id,
      concern_type_id: detail.concern_type_id,
      assigned_user_id: detail.assigned_user_id,
      assigned_user_is_developer: assigned_is_dev,
      created_at: detail.created_at,
      updated_at: detail.updated_at,
      name_for_id: detail.name_for_id.to_s,
      concern_ticket_id: detail.concern_ticket_id.to_s,
      data: detail.data
    }
  end

  @data_store = DataStore.find_or_initialize_by(
    data: {
      concern_ticket_id: permitted[:concern_ticket_id].to_s,
      start_date: permitted[:start_date],
      end_date: permitted[:end_date],
      concern_ticket_details: serialized_details
    },
    status: "active",
    start_date: permitted[:start_date],
    end_date: permitted[:end_date]
  )

  if @data_store.new_record?
    @data_store.save
  end

    redirect_to view_report_by_data_store_path(@data_store.id)
  end


  private

  def data_store_params
    params.require(:data_store).permit(:concern_ticket_id, :start_date, :end_date)
  end

  def parse_date(date_string)
    Date.parse(date_string) rescue nil
  end

  def load_data_store_records
    @records = DataStore
      .where.not("data ->> 'concern_ticket_id' IS NULL")
      .where.not("data ->> 'concern_ticket_id' = ''")
      .order(created_at: :desc)

    concern_ticket_ids = @records.map { |r| r.data["concern_ticket_id"] }.compact.uniq
    @concern_tickets_map = ConcernTicket.where(id: concern_ticket_ids).index_by(&:id)
  end

  def load_concern_fors(records)
    concern_for_ids = records.flat_map do |r|
      Array(r.data["concern_ticket_details"]).map { |d| d["name_for_id"].to_s if d.is_a?(Hash) }
    end.compact.uniq

    ConcernFor.where(id: concern_for_ids).index_by { |f| f.id.to_s }
    
  end

  def build_report_data(data_store)


  @details = Array(data_store&.data&.[]("concern_ticket_details")).select { |d| d.is_a?(Hash) }


  @details.each do |d|
    if d["data"].is_a?(Hash) && d["data"]["is_held"] == "true"
      d["status"] = "Hold"
    else
      raw_status = d["status"].to_s.strip.downcase
      d["status"] = STATUS_MAP[raw_status] || raw_status.titleize
    end
  end

  puts "Unique statuses after normalization: #{@details.map { |d| d['status'] }.uniq.inspect}"

  valid_details = @details.select { |d| d["assigned_user_is_developer"] }

  assigned_user_ids = valid_details.map { |d| d["assigned_user_id"].to_s }.reject(&:blank?).uniq
  branch_ids = @details.map { |d| d["branch_id"] }.compact.map(&:to_s).uniq

  @users = User.where(id: assigned_user_ids).index_by { |u| u.id.to_s }
  @branches = Branch.where(id: branch_ids).index_by { |b| b.id.to_s }

  @assigned_summary = valid_details.group_by { |d| d["assigned_user_id"].to_s }
  @valid_details = valid_details

  @total_tickets = @details.size
  @new_tickets = @details.count { |d| d["status"] == "Open" }
  @done_tickets = @details.count { |d| d["status"] == "Closed" }
  @hold_tickets = @details.count { |d| d["status"] == "Hold" } 

  @from_summary = @details.group_by { |d| d["name_for_id"].to_s }

  @status_groups = [
    "Open",
    "Processing",
    "Hold",
    "For Verification",
    "Closed"
  ]
  end


end
