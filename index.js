$(() => {
	var submitBtn = $("#submit");
	var tickerInput = $("#tickerInput");
	var loadingText = $("#loadingText");
	var errorText = $("#errorText");
	var chartContainer = $("#chartContainer");
	var infoContainer = $("#infoContainer");
	var bgTab = $("#bgTab");
	var bgPane = $("#bgPane");
	var sharePriceSlot = $("#sharePrice");
	var peRatioSlot = $("#peRatio");

	var chartData;

	errorText.hide();
	loadingText.hide();
	infoContainer.hide();

	submitBtn.on("click", async (e) => {
		errorText.fadeOut();
		var ticker = tickerInput.val();
		loadingText.fadeIn();
		const res = await fetch(`http://localhost:8080/ticker/${ticker}`);
		if (res.status === 200) {
			const data = await res.json();
			bgPane.html(data.background);
			chartData = data.stats;
			infoContainer.show();

			Chart.data.labels = chartData.map((row) => row.year);
			Chart.data.datasets[0].data = chartData.map((row) => row.pps);
			Chart.update();

			var latestYearData = chartData.slice(-1)[0];
			var curPPS = latestYearData.pps;
			var curEPS = latestYearData.eps;
			var peRatio = Math.floor((curPPS / curEPS) * 100) / 100;

			sharePriceSlot.html(`$${curPPS}`);
			peRatioSlot.html(`${peRatio}`);
		} else {
			errorText.fadeIn();
		}

		loadingText.fadeOut();
	});
});

var Chart = new Chart(document.getElementById("chartContainer"), {
	type: "line",
	data: {
		labels: [],
		datasets: [
			{
				label: "Stock Price",
				data: [],
			},
		],
	},
});
