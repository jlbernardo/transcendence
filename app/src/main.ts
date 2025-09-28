const btn = document.getElementById("api");

btn?.addEventListener("click", async () => {
	fetch("http://localhost:3000")
	.then((resp) => {
		resp.json().then((text) => {
			document.getElementById("rsp")!.innerHTML = text.hello;
		});
	});

})
