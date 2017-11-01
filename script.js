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
var p2ErrorElem = document.querySelector('#player2 p.error');
var p1ErrorElem = document.querySelector('#player1 p.error');
var answerElem = document.getElementById("word");

restartButton.addEventListener("click", restartGame);
submitWordButton.addEventListener("click", createNewAnswer);
init();

/* TODO CHECK 1. Validation of input fields
 *      2. Draw Hangman figure
 *      3. 
 */

function init() {
	document.getElementById("player1").style.display = "block";
	document.getElementById("player2").style.display = "none";
    submitButton.addEventListener("click", validateInput);
	//submitButton.addEventListener("click", compareAndDisplayOutcome);
}

function validateInput() {
	var input = userElem.value;
	p2ErrorElem.innerHTML = "";
	userElem.value = "";
	// If all letters
	if (validateAllLetters(input)) {
		// If not the entire correct answer, should only be one letter at a time
		if (input.length === 1) {
			compareAndDisplayOutcome(input);	
		} else if (input.length === correctAnswer.length) {
			areTheyAWinner(input);
		} else {
			//  Not a valid response, output message saying so
			p2ErrorElem.innerHTML = "Not a valid input. Enter either a single letter or the entire word.";
		}
	} else {
		p2ErrorElem.innerHTML = "Invalid input. You can only enter letters.";
	}
}
	
// Make sure that the input is all letters
function validateAllLetters(input) {
	console.log(input);
	if (input.match(/^[A-Za-z]+$/))
		return true;
	else
		return false;
}

// Validate that the proposed answer is only made of letters
function validateAnswer(answer) {
	if (validateAllLetters(answer) && answer.length > 0)
		return true;
	else
		return false;
}

function areTheyAWinner(input) {
	// Check to see if the input is the correct answer when guessing the entire word
	if (input === correctAnswer) { // Won
		outcomeElem.textContent = "You win!!!";
		for (var i = 0; i < correctAnswer.length; i++) {
			document.getElementById('guess_area').children[i].innerHTML = "_" + correctAnswer.charAt(i) + "_";  
		}
	} else { // Lost
		outcomeElem.textContent = "You lose!!!";
	}

	// Remove event listener to end the game
    submitButton.removeEventListener("click", validateInput);
}

function createNewAnswer () {

	p1ErrorElem.innerHTML = "";
	correctAnswer = answerElem.value;
	// Clear the input field
	answerElem.value = "";
	console.log(correctAnswer);

	// Check to make sure the answer is valid
	if (validateAnswer(correctAnswer)) { // Answer valid, continue as usual
		console.log("answer is valid");
		charsLeft = correctAnswer.length;

		var htmlString = '<span class="letter">___</span>  ';

		for (var i = 0; i < correctAnswer.length - 1; i++) {
			htmlString = htmlString + '<span class="letter">___</span>  ';
		}

		document.getElementById("guess_area").innerHTML = htmlString;

		document.getElementById("player2").style.display = "block";
		document.getElementById("player1").style.display = "none";
	} else {  //Answer is not valid, error message and reenter the message
		p1ErrorElem.innerHTML = "This is not a valid input.  It must be all letters.";
	}
}

function restartGame() {

	// Reset the outcome text to three dots
	outcomeElem.textContent = initialOutcome;
	guessesRemaining = 5;
	userElem.value = "";
	allGuesses = [];
	init();

}

function compareAndDisplayOutcome(userInput) {

    // var userInput = userElem.value;
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
        submitButton.removeEventListener("click", validateInput);
    }

}