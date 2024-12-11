class ProcessOnlineApplication < ApplicationJob
  queue_as :default

  def perform(args)
    begin
      online_application  = OnlineApplication.find(args[:id])
      user                = ReadOnlyUser.find(args[:user_id])

      cmd = ::OnlineApplications::Process.new(
              online_application: online_application,
              user: user
            )

      cmd.execute!
    rescue Exception => e
      online_application.update!(status: "error")
      logger.error(e.message)
      logger.error(e.backtrace.join("\r\n"))
      Rollbar.error(e)
    end
  end
end
