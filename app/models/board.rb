class Board < ActiveRecord::Base
	has_many :notes
	
	def self.validate_name(name)
		raise "Invalid board name, must consist of lowercase letters and dashes (eg: 'paradox' or 'with-all-my-heart')" unless name =~ /\A[a-z\-]+\z/
	end
end
