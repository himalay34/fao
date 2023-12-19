// ==UserScript==
// @name     Scrap Herbal Drug Generics
// @version  1
// @include  https://medex.com.bd/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require   https://cdn.jsdelivr.net/npm/pouchdb@7.3.1/dist/pouchdb.min.js
// ==/UserScript==

(function (window) {
  ("use strict");

  let rawUrl = window.location.href;
  let ee = rawUrl.split("?");
  let table = "drug_herbal_generics";

  function getNum(str) {
    var num = str.replace(/[^0-9]/g, "");
    return parseInt(num, 10);
  }
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  // total pages
  var totalPages = localStorage.getItem("herbalGenPages") || 14;
  if (
    rawUrl === "https://medex.com.bd/generics?herbal=1&page=1" ||
    rawUrl === "https://medex.com.bd/generics?herbal=1"
  ) {
    var ul = $(document).find(".pagination");
    var a = [];
    ul.children().each((i, el) => {
      a.push(i);
    });
    var t = localStorage.getItem("herbalGenPages");
    if (!t) localStorage.setItem("herbalGenPages", a.pop());
  }

  if (ee.length > 1) {
    //   // db name
    //   var table = `drug_forms`;

    if (ee[1].startsWith("herbal")) {
      var parent = $(document).find(".hoverable-block");
      var gens = [];
      parent.children().each((i, el) => {
        var name = $(el).find(".data-row-top").text().trim();
        var rawLink = $(el.parentElement).attr("href");
        if ((name, rawLink)) {
          var doc = {};
          doc._id = rawLink.split("/")[4];
          doc.name = name;
          doc.completed = false;
          doc.slug = rawLink.split("/")[5];
          gens.push(doc);
        }
      });
      var db = new PouchDB(table);
      db.bulkDocs(gens)
        .then(async (info) => {
          await delay(4000);
          // get current page number
          var pageNoPart = rawUrl.slice(-2);
          var pageNo = getNum(pageNoPart) || 1;
          var nextPage = pageNo + 1;
          if (nextPage <= totalPages) {
            var link = `https://medex.com.bd/generics?herbal=1&page=${nextPage}`;
            console.log(link);
            console.log(info);
            window.open(link);
          }
        })
        .catch(console.error);
    }
  }
})(window);
