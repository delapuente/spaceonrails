class PostsController < ApplicationController
  def new
    @post = Post.new
  end

  def create
    @post = Post.new(post_params)
    respond_to do |format|
      if @post.save
        format.html { redirect_to @post }
        format.json {
          render :json => { :status => :created },
                 :status => :created, :location => @post
        }
      else
        format.html { render 'new' }
        format.json {
          render :json => { :errors => @post.errors },
                 :status => :bad_request, :location => @post
        }
      end
    end
  end

  def show
    @post = Post.find(params[:id])
    respond_to do |format|
      format.html
      format.json { render json: @post }
    end
  end

  def index
    @posts = Post.paginate(:page => params[:page], :per_page => 5)

    respond_to do |format|
      format.html
      format.json { render json: {
        :page => @posts.current_page,
        :per_page => @posts.per_page,
        :total_entries => @posts.total_entries,
        :entries => @posts
      }, methods: [:post_picture] }
    end
  end

  def edit
    @post = Post.find(params[:id])
  end

  def update
    @post = Post.find(params[:id])
    respond_to do |format|
      if @post.update(post_params)
        format.html { redirect_to @post }
        format.json {
          render :json => { :status => :updated },
                 :status => :ok, :location => @post
        }
      else
        format.html { render 'edit' }
        format.json {
          render :json => { :errors => @post.errors },
                 :status => :bad_request, :location => @post
        }
      end
    end
  end

  def destroy
    @post = Post.find(params[:id])
    @post.destroy
    respond_to do |format|
      format.html { redirect_to posts_path }
      format.json {
        render :json => { :status => :deleted },
               :status => :ok, :location => @post
      }
    end
  end

  private
    def post_params
      params.require(:post).permit(:title, :text, :post_picture)
    end
end
