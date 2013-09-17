class BoardController < ApplicationController
	def index; end
	
	def load
		raise "You must supply a board name" if params[:board].blank?
		Board.validate_name(params[:board])
		board = Board.where(name: params[:board]).first
		board = Board.create(name: params[:board]) unless board
		redirect_to board_index_path(board: board.name) and return
	rescue => e
		flash[:error] = e.message
		redirect_to root_path and return
	end
end
