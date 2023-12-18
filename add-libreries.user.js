// ==UserScript==
// @name     Add Pouchdb,jquery,utils to Medex.com.bd
// @version  1
// @include  https://medex.com.bd/*
// ==/UserScript==

(function (window) {
  "use strict";
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

  loadJS("//cdn.jsdelivr.net/npm/pouchdb@8.0.1/dist/pouchdb.min.js", true);
  loadJS("https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js");
  loadJS("https://cdn.jsdelivr.net/gh/himalay34/fao/utils.js");

  window.exportDB = exportdb;

  //if(!window.PouchDB) window.PouchDB = PouchDB
})(window);
