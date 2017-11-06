var correctAnswer = "";
var guessesRemaining = 6;
var attempt = ""; //attempted filled in string guess
var charsLeft;
var allGuesses = [];
var isCanvas;
var context;

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
var canvas = document.getElementById("hangman");

restartButton.addEventListener("click", restartGame);
submitWordButton.addEventListener("click", createNewAnswer);
init();

/* TODO CHECK 1. Validation of input fields
 *      2. Draw Hangman figure
 *      3. 
 */

window.addEventListener("resize", function () {
	// var height = document.querySelector("canvas").clientHeight;
 	document.getElementById('outcome').style.margin = canvas.height / 2 + " auto";
});

function init() {
	document.getElementById("player1").style.display = "block";
	document.getElementById("player2").style.display = "none";
    submitButton.addEventListener("click", validateInput);
	//submitButton.addEventListener("click", compareAndDisplayOutcome);

	canvas = document.getElementById("hangman");
    isCanvas = false;

	if (canvas.getContext) {
		context = canvas.getContext('2d');
		isCanvas = true;

		// Draw the post
		context.beginPath();
		context.moveTo(56, 10);
		context.lineTo(56, 0);
		context.lineTo(170, 0);
		context.lineTo(170, 243);
		context.moveTo(112, 243);
		context.lineTo(228, 243);
		context.lineWidth = 2;
		context.stroke();
	} else {
		isCanvas = false;
		// Image of the post
	}
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
	guessesRemaining = 6;
	userElem.value = "";
	allGuesses = [];
	context.clearRect(0, 0, canvas.width, canvas.height);
	init();

}

function drawHead() {

	context.moveTo(85, 40);
    context.arc(56, 40, 30, 0, Math.PI * 2, true); // circle for the head
    context.stroke();
	
}

function drawBody(startX, startY, lineX, lineY) {

    context.moveTo(startX, startY);
    context.lineTo(lineX, lineY);
    context.stroke();

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
        outcomeElem.textContent = "You guessed correctly. Keep it up!";
    } else if ( guessesRemaining > 0 ) {
    	guessesRemaining--;

    	if (guessesRemaining === 0) {
    		outcomeElem.textContent = "You lose!!!";
        	//Remove the event listener to end game
        	submitButton.removeEventListener("click", validateInput);
    	} else {
    		outcomeElem.textContent = "Not quite. You have " + guessesRemaining + " guesses remaining.";
    	}

        switch (guessesRemaining) {
        	case 5: // Head
        		if (isCanvas) 
        			drawHead();
        		else {
        			// Add Image
        		}
        		break;
        	case 4: // Torso
        		if (isCanvas) {
        			drawBody(56, 70, 56, 153);
        		}
        		break;
        	case 3: // Left Arm
        		if (isCanvas)
        			drawBody(56, 93, 10, 93);
        		else {
        			// Add image
        		}
        		break;
        	case 2: // Right Arm
        		if (isCanvas)
        			drawBody(56, 93, 102, 93);
        		else {
        			// Add image
        		}
        		break;
        	case 1: // Left Leg
        		if (isCanvas)
        			drawBody(56, 153, 10, 223);
        		else {
        			// add image
        		}
        		break;
        	case 0: // Right Leg
        		if (isCanvas) {
        			drawBody(56, 153, 102, 223);
        			context.closePath();
        		} else {
        			// Add image
        		}
        		break;
        		
        	default:
        }

    }

}