#!/usr/bin/env node
// This tool reads the GeoNames list and output station names
// The data can be downloaded from http://download.geonames.org/export/dump/JP.zip
// Usage: extract_geonames_station.js JP.txt > stations.csv
const process = require("process");
const fs = require("fs");
const readline = require("readline");

if (process.argv.length != 3) {
  console.log("Usage: extract_geonames_station.js JP.txt");
  process.exit(1);
}

var lineReader = readline.createInterface({
  input: fs.createReadStream(process.argv[2])
});

console.log("japanese,english");

lineReader.on("line", function(line) {
  split = line.split("\t");
  var englishName = split[1].replace(/[ -]?eki$/i, "");
  const japaneseNames = split[3]
    .split(",")
    .filter(x => x.endsWith("えき") || x.endsWith("駅"));
  for (let japaneseName of japaneseNames) {
    console.log(
      japaneseName.replace(/えき$/, "").replace(/駅$/, "") + "," + englishName
    );
  }
});
