class BoardController < ApplicationController
	def index; end
	
	def load
		raise "You must supply a board name" if params[:board].blank?
		board = Board.where(name: params[:board]).first
		board = Board.create(name: params[:board]) unless board
		redirect_to board_index_path(board: board.id) and return
	end
end
