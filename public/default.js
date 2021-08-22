$("img").on("click", function(event) {
	let id = $(event.target).attr("value");
	window.location.replace("./show/" + id);
})