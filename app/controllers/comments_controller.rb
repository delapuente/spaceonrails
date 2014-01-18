class CommentsController < ApplicationController

  def create
    @post = Post.find(params[:post_id])
    @comment = @post.comments.create(params[:comment].permit(:commenter, :body))
    respond_to do |format|
      format.html { redirect_to post_path(@post) }
      format.json {
        render :json => { :status => :created },
               :status => :ok, :location => @comment
      }
    end
  end

  def destroy
    @post = Post.find(params[:post_id])
    @comment = @post.comments.find(params[:id])
    @comment.destroy
    respond_to do |format|
      format.html { redirect_to post_path(@post) }
      format.json {
        render :json => { :status => :deleted },
               :status => :ok
      }
    end
  end

  def index
    @comments = Post.find(params[:post_id]).comments
    respond_to do |format|
      format.json { render json: @comments }
    end
  end

end
