var correctAnswer = "";
var guessesRemaining = 5;
var attempt = ""; //attempted filled in string guess
var charsLeft;
var allGuesses = [];

// Convert HTML elements to JS object
var submitButton = document.getElementById("submit");
var submitWordButton = document.getElementById("submit_word");
var outcomeElem = document.getElementById("outcome");
var initialOutcome = outcomeElem.textContent;
var restartButton = document.getElementById("restart");
var userElem = document.getElementById("userinput");

restartButton.addEventListener("click", restartGame);
submitWordButton.addEventListener("click", createNewAnswer);
init();

/* TODO 1. Validation of input fields
 *      2. Draw Hangman figure
 *      3. 
 */
 

function init() {
	document.getElementById("player1").style.display = "block";
	document.getElementById("player2").style.display = "none";
	// submitButton.addEventListener("click", validateInput);
	submitButton.addEventListener("click", compareAndDisplayOutcome);
}

function validateInput(input) {
	// If not the entire correct answer should only be one letter at a time
	if (input.length === 1) {
		compareAndDisplayOutcome();	
	} else if (input.length > 1) {
		
	} else {

	}

}

function validateAnswer() {
	// Validate that the input word is only made of letters.
}

function createNewAnswer () {
	correctAnswer = document.getElementById("word").value;
	charsLeft = correctAnswer.length;

	var htmlString = '<span class="letter">___</span>  ';

	for (var i = 0; i < correctAnswer.length - 1; i++) {
		htmlString = htmlString + '<span class="letter">___</span>  ';
	}

	document.getElementById("guess_area").innerHTML = htmlString;

	document.getElementById("player2").style.display = "block";
	document.getElementById("player1").style.display = "none";

}

function restartGame() {

	// Reset the outcome text to three dots
	outcomeElem.textContent = initialOutcome;
	guessesRemaining = 5;
	userElem.value = "";
	allGuesses = [];
	init();

}

function compareAndDisplayOutcome() {

    var userInput = userElem.value;
	var change = 0;
	var right = false;
	var duplicate = false;

    for (var i = 0; i < correctAnswer.length; i++) {
    	if (allGuesses.includes(userInput)){
    		duplicate = true;
    	} else if (correctAnswer.charAt(i) === userInput) {
			right = true;
			attempt = attempt.substring(0, i) + userInput + attempt.substring(i + 1, attempt.length);
			//insert into the guess area
			var guessIndex = document.getElementById("guess_area").children[i];
			guessIndex.innerHTML = "_" + userInput + "_";

			charsLeft--;
			console.log(attempt);
		} 
    }

    allGuesses.push(userInput);

	if (charsLeft === 0) {
		outcomeElem.textContent = "You win!!!";
		//Remove the event listener to end the game
		submitButton.removeEventListener("click", validateInput);
	} else if (duplicate) {
    	outcomeElem.textContent = "You already guessed this letter! Guess again.";
	} else if (right) {
        outcomeElem.textContent = "You guessed correctly!";
    } else if ( guessesRemaining > 0 ) {
        outcomeElem.textContent = "Wrong, guess again! Guesses left: " + guessesRemaining;
        guessesRemaining--;
    } else {
        outcomeElem.textContent = "You lose!!!";
        //Remove the event listener to end game
    }

    // Original
    // if (correctAnswer === userInput) {
    //     outcomeElem.textContent = "You win!!!";
    // } else if ( guessesRemaining > 0 ) {
    //     outcomeElem.textContent = "Wrong, guess again! Guesses left: " + guessesRemaining;
    //     guessesRemaining--;
    // } else {
    //     outcomeElem.textContent = "You lose!!!";
    // }

    // userInput = "";
    userElem.value = "";

}