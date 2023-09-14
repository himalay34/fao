function loadJS(FILE_URL, async = true) {
  let scriptEle = document.createElement("script");
  scriptEle.setAttribute("src", FILE_URL);
  scriptEle.setAttribute("type", "text/javascript");
  scriptEle.setAttribute("async", async);
  document.body.appendChild(scriptEle);
  // success event 
  scriptEle.addEventListener("load", () => {
    console.log("File loaded")
  });
   // error event
  scriptEle.addEventListener("error", (ev) => {
    console.log("Error on loading file", ev);
  });
}

funcion getHarbalGens(name = 'harbalGenLinks'){
  var harbalGenLinks = new PouchDB(name)
  loadJS('https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js')
  var doc = $(document).find('a.hoverable-block')
  var docs = []
  doc.each((i,el)=>{
	  docs.push({_id:$(el).attr('href') })
  })
  harbalGenLinks.bulkDocs(docs).then(console.log).catch(console.error)
}
