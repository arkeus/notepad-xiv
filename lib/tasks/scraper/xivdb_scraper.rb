require "nokogiri"
require "open-uri"

class XivdbScraper
	NUM_PAGES = 131 #131
	
	def initialize(file)
		puts "Creating item database at #{file}"
		@file = File.open(file, "w")
	end
	
	def scrape
		items = []
		
		1.upto(NUM_PAGES) do |page|
			url = page_url(page)
			puts "Requesting #{url}"
			doc = Nokogiri::HTML(open(url))
			elements = doc.css("div[data-tooltip]")
			elements.each do |container|
				tooltip = Nokogiri::HTML(container['data-tooltip'])
				name = tooltip.css("h2").text
				element = container.css("div[style='float:left; width: 192px; padding:5px 0 0 3px;line-height:20px;']")
				url = element.css("a").first['href']
				id = url.split("/")[1]
				rarity = element.css("span").first['class'].split(" ").find { |c| c =~ /rarity/ }.split("_").last
				level = element.css("div[style='font-size:11px;opacity:0.8;']").first.to_s.match(/Lv<\/span>(\d+)</)[1]
				type = container.css("span[style='opacity:0.7;']").first.text
				item = { n: name, u: url, i: id, r: rarity, l: level, t: type }
				#puts item
				items << item
			end
			
			wait "Page #{page}"
		end
		
		@file.write(items.to_json)
	end
	
	def close
		@file.close if @file
	end
	
	private
	
	def page_url(page)
		URI::escape(%Q(http://xivdb.com/modules/search/search.php?query=!filters&pagearray={"item":#{page}}&language=1&filters="ITEMS:ICI_DATED_0"))
	end
	
	def get_column(element, column)
		return element[COLUMN_MAP[column]].text
	end
	
	def wait(message = nil, time = 5)
		puts "Sleeping (#{message}) - #{time}s"
		sleep(time)
	end
end