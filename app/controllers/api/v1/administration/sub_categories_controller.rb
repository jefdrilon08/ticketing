module Api
  module V1
    module Administration
      class SubCategoriesController < ApiController
        before_action :authenticate_user!

        # GET /api/v1/administration/sub_categories
        def index
          sub_categories = SubCategory.all
          render json: {
            status: 'success',
            sub_categories: sub_categories.as_json(only: [:id, :name, :code, :category_id])
          }, status: :ok
        rescue StandardError => e
          render json: { status: 'error', messages: [e.message] }, status: :unprocessable_entity
        end

        # POST /api/v1/administration/sub_categories
        def create
          # disallow client-supplied ID on create
          if params[:sub_category][:id].present?
            render json: {
              status: 'error',
              messages: ['ID should not be provided for create']
            }, status: :unprocessable_entity
            return
          end

          sub_category = SubCategory.new(sub_category_create_params)

          if sub_category.save
            render json: {
              status: 'success',
              message: 'Sub Category Created',
              sub_category: sub_category.as_json(only: [:id, :name, :code, :category_id])
            }, status: :created
          else
            render json: {
              status: 'error',
              messages: sub_category.errors.full_messages
            }, status: :unprocessable_entity
          end
        rescue StandardError => e
          render json: { status: 'error', messages: [e.message] }, status: :unprocessable_entity
        end

        # PUT /api/v1/administration/sub_categories/:id
        def update
          sub_category = SubCategory.find(params[:id])

          if sub_category.update(sub_category_update_params)
            render json: {
              status: 'success',
              message: 'Sub Category Updated',
              sub_category: sub_category.as_json(only: [:id, :name, :code, :category_id])
            }, status: :ok
          else
            render json: {
              status: 'error',
              messages: sub_category.errors.full_messages
            }, status: :unprocessable_entity
          end
        rescue ActiveRecord::RecordNotFound
          render json: { status: 'error', messages: ['SubCategory not found'] }, status: :not_found
        rescue StandardError => e
          render json: { status: 'error', messages: [e.message] }, status: :unprocessable_entity
        end

        # DELETE /api/v1/administration/sub_categories/:id
        def destroy
          sub_category = SubCategory.find(params[:id])
          if sub_category.destroy
            render json: { status: 'success', message: 'Sub Category Deleted' }, status: :ok
          else
            render json: {
              status: 'error',
              messages: ['Failed to delete subcategory']
            }, status: :unprocessable_entity
          end
        rescue ActiveRecord::RecordNotFound
          render json: { status: 'error', messages: ['SubCategory not found'] }, status: :not_found
        rescue StandardError => e
          render json: { status: 'error', messages: [e.message] }, status: :unprocessable_entity
        end

        private

        # Params for create: only name, code, category_id
        def sub_category_create_params
          params.require(:sub_category).permit(:name, :code, :category_id)
        end

        # Params for update: same as create
        def sub_category_update_params
          params.require(:sub_category).permit(:name, :code, :category_id)
        end
      end
    end
  end
end
