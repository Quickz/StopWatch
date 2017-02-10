(function() {


	/**
	 * global variables
	 *
	*/
	var timerElm = document.getElementById("timer");
	var scoreElm = document.getElementById("scores");
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
		
		timerElm.innerHTML = hr + min + sec;
	
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
		scores.push(timerElm.innerHTML);
		addScore(timerElm.innerHTML, scores.length - 1);
		saveScores();
	}


	/**
	 * adds a score to the html content
	 *
	*/
	function addScore(score, idNumber)
	{
		var id = "score" + idNumber;
		scoreElm.innerHTML += "<div id='" + id  +
							  "'class='score'>" +
						  	  score + "</div>";

		var scrElm = document.getElementById(id);// ERROR
		scrElm.onclick = function() {

			console.log("deleted");
			scoreElm.removeChild(scrElm);
			scores.splice(0, 1);
			saveScores();

		};

	}


	/**
	 * saves the scores into local storage
	 *
	*/
	function saveScores()
	{
		localStorage.scores = JSON.stringify(scores);
	}


	/**
	 * loads the scores from the local storage
	 *
	*/
	function loadScores()
	{
		if (!localStorage.scores) return;
		scores = JSON.parse(localStorage.scores);
		
		for (var i = 0; i < scores.length; i++)
			addScore(scores[i], i);
			
	}


})();
