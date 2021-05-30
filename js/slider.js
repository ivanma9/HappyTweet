document.addEventListener("DOMContentLoaded", function () {
	const city = document.getElementById("cityinput");
	const range = document.getElementById("happySlider");
	const div = document.querySelector(".moji");
	const mojis = [
		"😪",
		"🥺",
		"😩",
		"😞",
		"🙁",
		"😐",
		"🙂",
		"😀",
		"😄",
		"😎",
		"🤩",
	];

	range.addEventListener("input", (e) => {
		let rangeValue = Math.round(e.target.value /10);
		div.textContent = mojis[rangeValue];
		const bubble = document.querySelector(".bubble");

		setBubble(range, bubble);

		// Check browser support
		if (typeof Storage !== "undefined") {
			// Store
			sessionStorage.setItem("emojivalue", e.target.value);
		} else {
			console.log("Sorry, your browser does not support Web Storage...");
		}
	});
	function setBubble(range, bubble) {
		// const val = range.value;
		// const min = range.min ? range.min : 0;
		// const max = range.max ? range.max : 100;
		// const newVal = Number(((val - min) * 100) / (max - min));
		// bubble.innerHTML = val;

		// // Sorta magic numbers based on size of the native UI thumb
		// bubble.style.left = `${newVal}%`;
		const newValue = Number(
				((range.value - range.min) * 100) / (range.max - range.min)
			),
		newPosition =  -newValue * 0.20;
		bubble.innerHTML = range.value;
		bubble.style.left = `calc(${newValue}% + (${newPosition}px))`;
	}

	$(".submitbutton").on("submit", function () {
		console.log("selected");
		if (typeof Storage !== "undefined") {
			// Store
			sessionStorage.setItem("usercity", city.value);
		} else {
			console.log("Sorry, your browser does not support Web Storage...");
		}
	});
});
