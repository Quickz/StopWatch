(function($) {


	/**
	 * global variables
	 *
	*/
	var scores = [];
	var processing = false;
	var timer;
	var seconds = 0;
	var minutes = 0;
	var hours = 0;

	loadScores();


	/**
	 * timer keyboard controls
	 * 
	*/
	document.onkeydown = function(e) {

		switch (e.keyCode)
		{
			// space
			case 32:
			// enter
			case 13:
				e.preventDefault();
				toggleTimer();
				break;
		}


	};


	/**
	 * stops/starts the timer
	 *
	*/
	function toggleTimer()
	{
		if (processing)
			stopTimer();
		else
			startTimer();
	}


	/**
	 * stops the timer
	 *
	*/
	function stopTimer()
	{
		addNewScore();

		processing = false;
		clearTimeout(timer);
		seconds = 0;
		minutes = 0;
		hours = 0;
	}


	/**
	 * starts the timer
	 *
	*/
	function startTimer()
	{

		processing = true;
		updateDisplay();

		timer = setInterval(function() {
			
			seconds += 0.01;

			if (Math.round(seconds) > 59)
			{
				minutes++;
				seconds = 0;
			}

			if (minutes > 59)
			{
				hours++;
				minutes = 0;
			}

			updateDisplay();

		}, 10);

	}


	/**
	 * updates the timer html element contents
	 *
	*/
	function updateDisplay()
	{
		var sec = format(seconds.toFixed(2));
		var min = "";
		var hr = "";
		
		if (hours != 0)
		{
			hr = format(hours) + ":";
			min = format(minutes) + ":";
		}
		else if (minutes != 0)
			min = format(minutes) + ":";
		
		$("#timer").text(hr + min + sec);
	
	}


	/**
	 * adds a zero at the beginning
	 * if the number is less than 10
	*/
	function format(value)
	{
		if (value < 10)
			return  "0" + value;
		else
			return value;
	}


	/**
	 * adds and saves the scored time
	 *
	*/
	function addNewScore()
	{
		var text = $("#timer").text();
		scores.push(text);
		addScore(text, scores.length - 1);
		saveScores();
	}


	/**
	 * adds a score to the html content
	 *
	*/
	function addScore(score, idNum)
	{

		// element creation
		var newScore = $("<div>", {
			"class": "score",
			"text": score
		}).appendTo($("#scores"));

		// addition of the event
		$(".score:eq(" + idNum + ")").on("click", function() {

			scores.splice($(this).index(), 1);
			this.remove();
			saveScores();

		});

	}


	/**
	 * saves the scores into local storage
	 *
	*/
	function saveScores()
	{
		localStorage.StWscores = JSON.stringify(scores);
	}


	/**
	 * loads the scores from the local storage
	 *
	*/
	function loadScores()
	{
		if (!localStorage.StWscores) return;
		scores = JSON.parse(localStorage.StWscores);
		
		for (var i = 0; i < scores.length; i++)
			addScore(scores[i], i);
			
	}


})(jQuery);
