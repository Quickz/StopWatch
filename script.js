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

	/**
	 * prevents key down/up events
	 * from firing twice in a row
	 */
	var keyDown = false;

	$("#scores").on("click", ".score", deleteScore);
	$("#reset").on("click", resetScores);
	$("#import").on("click", toggleImport);
	$("#export").on("click", toggleExport);
	$("#ok-imp").on("click", acceptImport);
	$("#cancel-imp").on("click", toggleImport);
	$("#close-exp").on("click", toggleExport);
	$("#copy-exp").on("click", copyExport);
	loadScores();


	/**
	 * timer keyboard controls
	 * triggered when pressing a key down
	 */
	document.onkeydown = function(e) {

		switch (e.keyCode)
		{
			// space
			case 32:
			// enter
			case 13:
				e.preventDefault();

				if (processing)
				{
					stopTimer();
					keyDown = true;
				}

				break;
		}

	};


	/**
	 * timer keyboard controls
	 * triggered when releasing a key
	 */
	document.onkeyup = function(e) {

		switch (e.keyCode)
		{
			// space
			case 32:
			// enter
			case 13:
				e.preventDefault();

				if (!processing && !keyDown)
					startTimer();
				else
					keyDown = false;

				break;
		}

	};


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

	}

	
	/**
	 * deletes a score entry
	 * 
	 */
	function deleteScore()
	{

		var text = $(this).text();
		var message = "Are you sure you want to " +
				      "delete the \"" + text + "\"?";

		if (confirm(message))
		{
			scores.splice($(this).index() - 1, 1);
			this.remove();
			saveScores();
		}

	}


	/**
	 * deletes all of the saved scores
	 *
	 */
	function resetScores()
	{
		var message = "Are you sure you want to reset all of your scores?";
		
		if (confirm(message))
		{
			scores = [];
			$(".score").remove();
			saveScores();
		}

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


	/**
	 * opens/closes a text window
	 * for importing data
	 */
	function toggleImport()
	{
	 	$("#import-cont").toggle();
		$("#export-cont").hide();
		$("#import-txt").val("");
	}


	/**
	 * accepts the input and replaces
	 * previous scores with new ones
	 */
	function acceptImport()
	{
		var text = $("#import-txt").val().trim();
		scores = text.split(" ");
		$(".score").remove();
		saveScores();
		loadScores();
		toggleImport();
	}


	/**
	 * opens/closes a text window with
	 * score data in a text form
	 */
	function toggleExport()
	{
		var text = $("#export-txt");
		var container = $("#export-cont");

		container.toggle();
		$("#import-cont").hide();

		var visible = container.is(":visible");
		if (visible)
		{
			text.val("");
			for (var i = 0; i < scores.length; i++)
				text.val(text.val() + scores[i] + " ");
		}

	}


	/**
	 * copies the generated exportable
	 * data - scores
	 */
	function copyExport()
	{
		var text = document.getElementById("export-txt");
		if (document.selection)
		{
            var range = document.body.createTextRange();
            range.moveToElementText(text);
            range.select();
        }
        else if (window.getSelection)
        {
            var range = document.createRange();
            text.select();
            window.getSelection().addRange(range);
        }
        document.execCommand("copy");
	}


})(jQuery);
