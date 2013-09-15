class NotepadController < ApplicationController
	before_filter :initialize_board
	around_filter :ajax_request, except: [:index]
	
	def index
		@recent_notes = @board.notes.order("id desc").limit(20)
	end
	
	# /:board/add/:item
	def add
		raise "You must supply an item" unless params[:item]
		note = Note.create(board_id: @board.id, item: params[:item], price: params[:price])
		render json: note
	end
	
	# /:board/remove/:note
	def remove
		raise "You must supply a note id" unless params[:note]
		Note.destroy_all(board_id: @board.id, id: params[:note])
		render nothing: true
	end
	
	# /:board/list/:item
	def list
		raise "You must supply an item" unless params[:item]
		notes = @board.notes.where(item: params[:item]).select("id, hq, price, item").order("id desc")
		render json: notes
	end
	
	# /:board/recent
	def recent
		notes = @board.notes.order("id desc").limit(19)
		render json: notes
	end
	
	private
	
	def initialize_board
		raise "You must supply a board" unless params[:board]
		@board = Board.find(params[:board])
	end
	
	def ajax_request
		begin
			yield
		rescue => e
			render text: e.message
		end
	end
end
