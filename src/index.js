import html2canvas from "html2canvas";
import stationsArray from "./stations.csv";
import trainsArray from "./trains.csv";

const isPrintPage = document.body.innerHTML.indexOf("window.print") != -1;
const screenshot = isPrintPage;
const srline = document.getElementById("srline");
const title = document.getElementsByClassName("labelSearchResult")[0];

// Convert station into object for quick lookup
const stationsMap = {};
for (let s of stationsArray) {
  stationsMap[s.japanese] = s.english;
}

function translateStation(japanese) {
  const parenthesisIdx = japanese.indexOf("(");
  if (parenthesisIdx != -1) {
    japanese = japanese.substring(0, parenthesisIdx);
  }
  const englishName = stationsMap[japanese];
  if (englishName) {
    return englishName;
  }

  return stationsMap[japanese.replace("ケ", "ヶ")];
}

function translateStationOrJapanese(japanese) {
  var englishName = translateStation(japanese);
  if (englishName) return englishName;
  else return japanese;
}

// Translate stations
var stations = document.querySelectorAll(".station dt a"); // Normal page
if (!stations.length) stations = document.querySelectorAll(".station dt"); // Printable page
for (let s of stations) {
  const englishName = translateStation(s.innerText);
  if (englishName) {
    s.innerText += " " + englishName;
  }
}

// TODO: Separate into another module with tests
function translateTrain(japanese, english) {
  if (english === undefined) {
    // Initial run
    english = "";
  }
  if (japanese.length == 0) {
    // End of translation
    return english;
  }

  for (let train of trainsArray) {
    const match = japanese.match("^" + train.japanese);
    if (match) {
      var englishPart = train.english;
      if (englishPart.indexOf("$1") != -1) {
        // Translate station if present
        var part = match[1]
          .split("・")
          .map(translateStationOrJapanese)
          .join("・");
        englishPart = englishPart.replace("$1", part);
      }
      const newEnglish = english + englishPart;
      return translateTrain(japanese.substring(match[0].length), newEnglish);
    }
  }

  // Nothing match, trim 1
  return translateTrain(
    japanese.substring(1),
    english + japanese.substring(0, 1)
  );
}

// Translate trains
for (let transport of document.querySelectorAll(".transport div")) {
  const textNode = transport.childNodes[2];
  const textValue = textNode.nodeValue.trim();
  transport.innerHTML += "<br>" + translateTrain(textValue);
}

// Translate fare
for (let fare of document.querySelectorAll(".fare")) {
  fare.innerHTML = fare.innerHTML
    .replace("指定席：", "Reserved: ")
    .replace("自由席：", "Unreserved: ")
    .replace("現金：", "Cash: ")
    .replace(/([0-9,]+)円/, "¥$1");
}

// Translate header
const routeSummary = document.getElementsByClassName("routeSummary")[0];
routeSummary.innerHTML = routeSummary.innerHTML
  .replace("発", "")
  .replace("着", "")
  .replace(/時間/g, "h ")
  .replace(/分/g, "m")
  .replace("乗車券", "Fare: ")
  .replace("特別料金", "Seat Fee: ")
  .replace("(乗車", " (on board ") // print page
  .replace("乗車", "on board ") // normal page
  .replace("乗換：", "Transfers: ")
  .replace("回", "")
  .replace("現金優先：", "Cash Preferred: ")
  .replace("IC優先：", "IC Preferred: ")
  .replace(/([0-9,]+)円/g, "¥$1");

// Translate header of stations
const stationHeader = document.querySelector(".title").childNodes[0];
stationHeader.nodeValue = stationHeader.nodeValue
  .split("→")
  .map(translateStationOrJapanese)
  .join("→");

// Tranlsate time
const time = document.querySelector(".title .time");
time.innerHTML = time.innerHTML
  .replace("年", "-")
  .replace("月", "-")
  .replace("日", " ")
  .replace("出発", " Departure")
  .replace("到着", " Arrival");

// Get rid of little icons and teikiken
function removeElement(selector) {
  const element = document.querySelector(selector);
  if (element) {
    element.remove();
  }
}
if (isPrintPage) {
  removeElement(".routeSummary .priority");
  removeElement(".pass");
}

if (screenshot) {
  // Work around an issue causing the image to be trimmed
  srline.style.paddingRight = "10px";

  // Move title into srline so we include it too
  srline.prepend(title);

  // Take screenshot
  html2canvas(srline, {
    // Display images
    allowTaint: true,
    // Generate HiDPI image
    scale: 2
  }).then(canvas => {
    var notes = document.createElement("div");
    notes.innerHTML =
      "<br>You can now right click to copy the image." +
      "<br>Found issues or missing translations? File a report or PR at <a href='https://github.com/pawitp/yahoo-transit-english'>GitHub</a>.";
    document.body.innerHTML = "";
    document.body.appendChild(canvas);
    document.body.appendChild(notes);
  });
}
