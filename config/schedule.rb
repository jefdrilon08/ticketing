# Use this file to easily define all of your cron jobs.
#
# It's helpful, but not entirely necessary to understand cron before proceeding.
# http://en.wikipedia.org/wiki/Cron

# Example:
#
# set :output, "/path/to/my/cron_log.log"
#
# every 2.hours do
#   command "/usr/bin/some_great_command"
#   runner "MyModel.some_method"
#   rake "some:great:rake:task"
# end
#
# every 4.days do
#   runner "AnotherModel.prune_old_records"
# end

#every :day, at: '6pm' do
#  rake "adjust:update_member_insurance_status"
#end
#
#every :day, at: '6am' do
#  rake "finance:autorenew_time_deposit_accounts"
#end

set :output, {:error => "log/cron_error_log.log", :standard => "log/cron_log.log"}
env :PATH, ENV['PATH']

# every :day, at: '9pm' do
#   rake "generate:members_file"
#   rake "generate:beneficiaries_file"
#   rake "generate:legal_dependents_file"
#   rake "generate:member_accounts_file"
#   rake "generate:account_transactions_file"
# end

every :day, at: '4am' do
  rake "adjust:update_insurance_status"
end

every :day, at: '4:45am' do
  rake "adjust:process_insurance_member_counts"
  rake "adjust:process_personal_funds"
  rake "adjust:process_claims_counts"
  rake "adjust:process_uploaded_documents_counts"
end

every :day, at: '1am' do
  rake "adjust:set_max_active_date"
  rake "adjust:fill_recognition_date_from_membership_payment"
end

#runs on at the end of each month
every '30 21 28-31 * *' do
    rake "adjust:process_member_quarterly_reports"
end

# Learn more: http://github.com/javan/whenever
