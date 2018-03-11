# Yahoo! Transit English

This is a bookmarklet with two functionalities:

1.  Translate result of Yahoo! Transit Japan (<https://transit.yahoo.co.jp/>) into English.
2.  Convert printable result into a high-resolution image for easy copying into a travel
    itinerary for personal use.

When used on normal result pages, only the translate function will be active. The
convert-to-screenshot functionality will automatically activate on "print" (印刷する) pages.

# Usage

Install the bookmarklet from <https://y-transit-eng.netlify.com>.

# Development

1.  Run `yarn install`
2.  Run `yarn dev`

This will bring up a web server and your web browser will be opened to a default page containing
a link to the development bookmarklet you can use.

## Data

### Station Data

Station names in both English and Japanese were extracted from GeoNames licensed under CC BY 4.0.
The extraction script is located at `tools/extract_geonames_station.js`.

### Train Data

The train and line name data exists in `src/trains.csv` and was manually inputted. This is severely
incomplete, and contributions are very welcome.
