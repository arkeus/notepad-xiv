require "tasks/scraper/item_scraper"
require "tasks/scraper/xivdb_scraper"

namespace :scraper do
	def scrape(scraper)
		scraper.scrape
	ensure
		scraper.close
	end
		
	task :zam, :file do |task, args|
		scrape(ItemScraper.new(args[:file]))
	end
	
	task :xivdb, :file do |task, args|
		scrape(XivdbScraper.new(args[:file]))
	end
end