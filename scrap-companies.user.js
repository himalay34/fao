// ==UserScript==
// @name     Scrap Drug Companies
// @version  1
// @include  https://medex.com.bd/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require   https://cdn.jsdelivr.net/npm/pouchdb@7.3.1/dist/pouchdb.min.js
// ==/UserScript==

(function (window) {
  "use strict";

  let rawUrl = window.location.href;
  let ee = rawUrl.split("/");
  // db name
  var table = `drug_companies`;

  if (ee[3].startsWith("companies")) {
    //let dbName = `companies_${new Date().toJSON().split("T")[0]}`;
    var db = new PouchDB(table);
    var parent = $(document).find(".row.data-row");
    var companies = [];
    parent.children().each((i, r) => {
      var name = $(r).find("a").text().trim();
      var link = $(r).find("a").attr("href"); //.split("/")[4]
      if (name && link) {
        companies.push({ _id: link.split("/")[4], name: name });
        console.log(name, link.split("/")[4]);
      }
    });
    db.bulkDocs(companies).then(console.log).catch(console.error);
  }
})(window);
