module ApplicationHelper
  def fetch_valid_roles(module_name)
    ::Users::FetchValidRoles.new(
      module_name: module_name
    ).execute!
  end


  def is_cm_mis?
    is_cm_mis = ["MIS", "CM"].include? current_user.roles.last
  end
  def is_mis_so_fm?
    #is_mis_so_fm = ["MIS", "SO", "FM"].include? current_user.roles.last
    result = current_user.roles.include?("MIS") || current_user.roles.include?("FM") || current_user.roles.include?("SO")

  end

  def is_mis?
    is_mis = ["MIS"].include? current_user.roles.last
  end
  def is_mis_fm?
    result = current_user.roles.include?("MIS") || current_user.roles.include?("FM")
  end

  def is_mis_user?
    current_user.roles.include?("MIS")
  end

  def is_remote_bk_user?
    current_user.roles.include?("REMOTE-BK")
  end

  def is_remote_fm_user?
    current_user.roles.include?("REMOTE-FM")
  end

  def is_bk?
    current_user.roles.include?("BK")
  end

  def sbk_mis_bk_oas?
      sbk_mis_bk_oas = ["MIS", "SBK", "BK", "OAS"].include? current_user.roles.last
  end

  def sbk_mis_bk?
    sbk_mis_bk_oas = ["MIS", "SBK", "BK"].include? current_user.roles.last
  end

  def sbk_mis_user
    sbk_mis_user = ["SBK","MIS"].include? current_user.roles.last
  end
  
  def bk_mis_user
    bk_mis_user = ["MIS","BK"].include? current_user.roles.last
  end
  
  def so_mis_user
   result = current_user.roles.include?("MIS") || current_user.roles.include?("SO")
  end

  def sbk_bk_mis_user
    result = current_user.roles.include?("MIS") || current_user.roles.include?("SBK") || current_user.roles.include?("BK")
    #sbk_bk_mis_user = ["SBK","MIS","BK"].include? current_user.roles.last
  end

  def oas_mis_user
    oas_mis_user = ["OAS","MIS","SO"].include? current_user.roles.last
  end
  
  def bk_mis_fm_sbk_user
    bk_mis_fm_sbk_user = ["BK","MIS","FM","SBK"].include? current_user.roles.last
  end

  def title(*args)
    key = "titles.#{params[:controller].gsub("/", ".")}.#{params[:action]}"
    content_for :title, t(key, title: args.join(" - "))
  end

  # Examples:
  #
  # { "pages" => "about" } -> #about action in PagesController
  # { "pages" => nil } -> any action in PagesController
  # { "a" => ["b", "c"], "d" => nil } -> #b and #c actions in AController, and any action in DController
  def active_class(hash_set, name: "active")
    return if !hash_set

    actions = hash_set[params[:controller]]

    return name if hash_set.key?(params[:controller]) && (actions.nil? || actions&.include?(params[:action]))
  end


  def fetch_centers(branch)
    Center.where(branch_id: branch.id).order("name ASC").map { |c|
      {
        id: c.id,
        name: c.name
      }
    }
  end



  def templates
    names = []

    if Settings.templates.present?
      Settings.templates.each do |o|
        names << o.name
      end
    end

    return names
  end

  def member_resignation_types
    Settings.member_resignation_types.map{ |o|
      {
        name: o.name,
        particulars: o.particulars.map{ |oo|
          {
            code: oo.code,
            name: oo.name
          }
        }
      }
    }
  end

  def resignation_types

    data  = []
    Settings.member_resignation_types.each do |o|
      data << o.name
    end

    data
  end




  def development?
    ENV['RAILS_ENV'] == 'development'
  end

  def microloans?
    Settings.activate_microloans.present? and Settings.activate_microloans == true
  end

  def microinsurance?
    Settings.activate_microinsurance.present? and Settings.activate_microinsurance == true
  end

  def current_month_start
    d = Date.today
    current_month = d.month - 1
    current_year  = d.year
    Date.civil(current_year, current_month, 1).strftime("%Y-%m-%d")
  end

  def current_month_end
    d = Date.today
    current_month = d.month - 1
    current_year  = d.year
    Date.civil(current_year, current_month, -1).strftime("%Y-%m-%d")
  end

  def debug?
    params[:debug].present?
  end


  
end
