class ProcessAssetsLiabilities < ApplicationJob
	queue_as :accounting

	def perform(sidekiq)
		data_store = DataStore.find(sidekiq[:id])
		user = User.find(sidekiq[:user_id])

		begin
		 config = {data_store: data_store.id,user: user.id }
		 	data_store = ::DataStores::GenerateAssetsLiabilities.new(config: config).execute!
		 	data_store.update!(status: "done")
				rescue Exception => e
					data_store.update!(
						status: "error",
						data: {
						exception: e,
						application_trace: Rails.backtrace_cleaner.clean(e.backtrace)
						}
					)
		end
	end

end