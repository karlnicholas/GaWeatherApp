# Georgia Weather map

Vanilla canvas front end. Station glyphs are drawn over a Georgia outline; live data comes from the Java BFF at `http://localhost:8080/api/gastations`.

## Setup

1. Install [Node.js](https://nodejs.org/) 18 or newer
2. From this directory: `npm install`
3. `npm start` and open the URL Parcel prints (usually `http://localhost:1234`)
4. Run the Spring Boot app on port 8080 so the map has data

## Commands

* `npm start` — development server
* `npm run build` — production files in `dist/`
