class Post < ActiveRecord::Base
  has_many :comments, dependent: :destroy
  has_attached_file :post_picture
  validates :title, presence: true,
                    length: { minimum: 4 }
end
