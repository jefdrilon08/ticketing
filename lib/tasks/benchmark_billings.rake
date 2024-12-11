namespace :benchmark_billings do
  task :controller_index => :environment do
    require 'benchmark/ips'

    USER_ID     = ENV['USER_ID']
    ITERATIONS  = ENV['ITERATIONS'].try(:to_i) || 1

    params = {
      start_date: ENV['START_DATE'].try(:to_date),
      end_date:   ENV['END_DATE'].try(:to_date)
    }


    ITERATIONS.times do |i|
      puts "ITERATION #{i}"
      puts "==============================="

      Benchmark.ips do |b|
        b.report("Index"){
          current_user = User.find(USER_ID)

          default_branch_name = Settings.try(:defaults).try(:default_branch).try(:name)

          branches  = ReadOnlyBranch
                        .joins(user_branches: :user)
                        .where(user_branches: { active: true, user_id: current_user.id })
                        .order("name#{" = '#{default_branch_name}'" if default_branch_name} ASC")

          billings  = ReadOnlyBilling
                        .includes(:center, :branch)
                        .where(branch_id: branches.pluck(:id))

          if params[:start_date].present? and params[:end_date].present?
            billings = billings.where("collection_date >= ? AND collection_date <= ?", params[:start_date], params[:end_date])
          end

          if params[:branch_id].present?
            branch   = ReadOnlyBranch.find(params[:branch_id])
            billings = billings.where(branch_id: branch.id)
          end

          if params[:center_id].present?
            center   = ReadOnlyCenter.find(params[:center_id])
            billings = billings.where(center_id: center.id)
          end

          if params[:status].present?
            status = params[:status]
            billings = billings.where(status: status)
          end

          billings = billings.order("status DESC, collection_date DESC").page(params[:page]).per(LIST_PAGE_SIZE)
        }
      end
    end
  end
end
