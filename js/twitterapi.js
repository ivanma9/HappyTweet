$.ajax({
	type: "POST",
	url: "http://https://api.twitter.com/2/tweets/search/stream/rules.com/example.php",
	data: {
		add: [{ value: "cat has:geo", tag: "cats with geo" }],
	},
	success: function (data) {
		console.log(data);
		//do something when request is successfull
	},
	dataType: "json",
});
