function loadJS(FILE_URL, async = true) {
  let scriptEle = document.createElement("script");
  scriptEle.setAttribute("src", FILE_URL);
  scriptEle.setAttribute("type", "text/javascript");
  scriptEle.setAttribute("async", async);
  document.body.appendChild(scriptEle);
  // success event
  scriptEle.addEventListener("load", () => {
    console.log("File loaded");
  });
  // error event
  scriptEle.addEventListener("error", (ev) => {
    console.log("Error on loading file", ev);
  });
}

loadJS("//cdn.jsdelivr.net/npm/pouchdb@8.0.1/dist/pouchdb.min.js", true);
loadJS("https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js");

function getHarbalGens(name = "harbalGenLinks") {
  var harbalGenLinks = new PouchDB(name);
  var doc = $(document).find("a.hoverable-block");
  var docs = [];
  doc.each((i, el) => {
    docs.push({ _id: $(el).attr("href") });
  });
  harbalGenLinks.bulkDocs(docs).then(console.log).catch(console.error);
}
function exportdb(db) {
  db.allDocs({ include_docs: true }, (error, doc) => {
    if (error) console.error(error);
    else
      download(
        JSON.stringify(doc.rows.map(({ doc }) => doc)),
        db.name + new Date().toJSON().split("T")[0] + ".json",
        "text/plain"
      );
  });
}

function download(data, filename, type = "text/plain") {
  var file = new Blob([data], { type: type });
  if (window.navigator.msSaveOrOpenBlob)
    // IE10+
    window.navigator.msSaveOrOpenBlob(file, filename);
  else {
    // Others
    var a = document.createElement("a"),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
}
function getNum(str) {
  var num = str.replace(/[^0-9]/g, "");
  return parseInt(num, 10);
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function allDocs(db, cb) {
  db.allDocs({ include_docs: true })
    .then((res) => res.rows.map((r) => r.doc))
    .then((docs) => {
      cb(null, docs);
    })
    .catch((err) => cb(err));
}

function addButton(text, onclick, cssObj, id = "btn") {
  cssObj = cssObj || {
    position: "absolute",
    bottom: "7%",
    right: "4%",
    "z-index": 3,
  };
  let button = document.createElement("button"),
    btnStyle = button.style;
  document.body.appendChild(button);
  button.innerHTML = text;
  button.onclick = onclick;
  btnStyle.position = "absolute";
  Object.keys(cssObj).forEach((key) => (btnStyle[key] = cssObj[key]));
  return button;
}
