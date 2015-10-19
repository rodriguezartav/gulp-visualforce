var sectionsDiv = document.querySelector(".sections");

var bulk = require('bulk-require');
var sections = bulk(__dirname, [ 'sections/*.html', 'snippets/*.html' ]);

for( sectionKey in sections.sections ){
	sectionsDiv.innerHTML += sections.sections[sectionKey];
}

var snippets = document.querySelectorAll("pre");
for (var i = snippets.length - 1; i >= 0; i--) {
	var snippet = snippets[i];
	
	snippet.classList.add("prettyify");
	snippet.classList.add("lang-js");
	snippet.classList.add("linenums");

	var html = sections.snippets[ snippet.dataset.id ];
	if(html){
		var p = document.createTextNode(html); 
  	snippet.appendChild(p);
  }
};