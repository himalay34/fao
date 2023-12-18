// ==UserScript==
// @name     Scrap Drug Forms
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
  var table = `drug_forms`;

  if (ee[3].startsWith("dosage-forms")) {
    var db = new PouchDB(table);
    var fparent = $(document).find(".hoverable-block");
    var forms = [];
    fparent.children().each((i, el) => {
      var name = $(el).find(".data-row-top").text().trim();
      var rawLink = $(el.parentElement).attr("href");
      var rawImg = $(el).find("img").attr("src");
      if ((name, rawLink, rawImg)) {
        var doc = {};
        doc._id = rawLink.split("/")[4];
        doc.name = name;
        doc.img = rawImg.split("/")[5];
        forms.push(doc);
      }
    });
    db.bulkDocs(forms).then(console.log).catch(console.error);
  }
})(window);
