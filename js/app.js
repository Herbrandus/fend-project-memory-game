/*
 * Memory game 
 * Assignment by Udacity
 * written by Gerben Boersma
 * april 2018
 *
 */

// These are all the cards available
const allCardsArray = [
	'diamond',
	'diamond',
	'plane',
	'plane',
	'anchor',
	'anchor',
	'bolt',
	'bolt',
	'cube',
	'cube',
	'leaf',
	'leaf',
	'bike',
	'bike',
	'bomb',
	'bomb'
];

// An arraay with just all the unique cards
const uniqueCardsArray = [
	'diamond',
	'plane',
	'anchor',
	'bolt',
	'cube',
	'leaf',
	'bike',
	'bomb'
];

/* object linking the array names for each card
 * with the class names used to display them
 */
const cardIcons = {
	diamond: 'fa-diamond',
	plane: 'fa-paper-plane-o',
	anchor: 'fa-anchor',
	bolt: 'fa-bolt',
	cube: 'fa-cube',
	leaf: 'fa-leaf',
	bike: 'fa-bicycle',
	bomb: 'fa-bomb'
};

// the maximum amount of allowed moves :)
const startingMoves = 4;

// declare all variables for the game mechanics
let cards;
let activeCards;
let openCards;
let movesMade;
let failedMatches;
let winningSpree;

// add display timer
let playTimer;
let seconds;
let minutes;

/* these variables are used to disable play while
 * the animations are playing
 */
let pauseTimer;
let disablePlay;

// save some elements to variables to use later
const resetButton = document.querySelector('.restart');
const againButton = document.getElementById('again');
const deck = document.querySelector('ul.deck');
const endScreen = document.getElementById('endingScreen');

let movesNum = document.querySelector('.moves');
let movesText = document.querySelector('.movesText');
let starsContainer = document.querySelector('.stars');
let displayTimer = document.getElementById('timer');
let movesCounter = document.getElementById('moves');

/**************************************************************************************
 ******************************** Game functions **************************************
 **************************************************************************************
 */

/* reset the game to start again
 * Used for the reset button at the top and for the 'play again' button at the end
 */
function reset() {

	// empty deck at first
	deck.innerHTML = '';

	// shuffle the deck
	let shuffledDeck = shuffle(allCardsArray);
	
	// reset all starting variables
	movesMade = 0;
	winningSpree = 0;
	failedMatches = 0;
	activeCards = [];
	openCards = [];
	disablePlay = false;
	seconds = 0;
	minutes = 0;

	clearInterval(playTimer);

	let deckHtml = '';

	shuffledDeck.forEach(function(elem){
		let cardClass = cardIcons[elem];
	 	deckHtml += '<li class="card">' +
	 			'<i class="fa ' + cardClass + '"></i>' +
				'</li>';

		activeCards.push(elem);
	});

	deck.innerHTML = deckHtml;

	/* now that the deck is shuffled and the cards are
	 * in the DOM, store them in this variable
	 */
	cards = document.querySelectorAll('.card');

	// add the event listeners to all cards in the game
	for (var i=0; i<cards.length; i++) {

		cards[i].addEventListener('click', function(){

			/* only allow the function when there is no 
			 * animation playing or defeat
			 */
			if (!disablePlay) {
				openCard(this);
			}
		});
	}

	// fill the stars list with correct amount of stars
	let newStarsHtml = '';
	
	for (var i=0; i < startingMoves; i++) {
		newStarsHtml += '<li><i class="fa fa-star"></i></li>';
	}

	starsContainer.innerHTML = newStarsHtml;

	// reset amount of moves to be made
	movesNum.innerHTML = startingMoves;
	movesText.innerHTML = 'Moves';
	movesCounter.innerText = movesMade;
	
	// set timer
	displayTimer.innerHTML = '0.00';

	// display and set timer for the game
	playTimer = setInterval(function(){

		let displaySeconds = '';

		seconds += 1;

		// formatting of time string
		if (seconds === 0) {
			displaySeconds = '00';
		} else if (seconds < 10) {
			displaySeconds = '0' + seconds;
		} else if (seconds === 60) {
			seconds = 0;
			displaySeconds = '00';
			minutes += 1;
		} else {
			displaySeconds = seconds;
		}

		displayTimer.innerHTML = minutes + '.' + displaySeconds;

	}, 1000);
}


/* this function is called when clicking on a card
 */
function openCard (elem) {

	elem.classList.add('open', 'show');
	let innerClass = elem.querySelector('.fa');

	handleOpenCards(innerClass.classList);
}


/* check if there are more cards than 1 opened
 */
function handleOpenCards (classList) {

	let openCardClass = classList.value;

	uniqueCardsArray.forEach(function(elem){
		let cardClass = cardIcons[elem];
		if (openCardClass.indexOf(cardClass) != -1) {
			openCards.push(elem);
		}
	});

	// if there are 2 cards open, we need to check if they match
	if (openCards.length === 2) {
		matchCards();
	}
}


/* function for matching the cards that are open
 */
function matchCards () {

	let shownCards = document.querySelectorAll('.card.open.show');
	let itsamatch;

	/* when both open cards are the same
	 * show the player it's a match!
	 */
	if (openCards[0] === openCards[1]) {

		shownCards[0].classList.add('match');
		shownCards[1].classList.add('match');
		itsamatch = true;

		// add one, because who knows...
		winningSpree++;

	} else {

		// there is no match, show this to the player
		shownCards[0].classList.add('error');
		shownCards[1].classList.add('error');
		itsamatch = false;
		failedMatches++;

		// remove a star from the total amount
		if (failedMatches === 2) {
			substractOneMove();
			failedMatches = 0;
		}
		
		winningSpree = 0;
	}

	/* disable the cards visibly by adding a class
	 * to be removed again after the timeOut
	 */
	addClassesToAll(cards, 'disabled');

	// update the amount of moves made
	movesMade++;
	movesCounter.innerText = movesMade;

	/* if the player has 3 correct guesses in a row
	 * reward him by returning 1 lost star
	 */
	if (winningSpree === 4) {
		addOneMove();
		winningSpree = 0;
	}

	disablePlay = true;
	pauseTimer = setTimeout(function(){

		// deactivate the opened cards
		removeActiveStatus(shownCards[0], itsamatch);
		removeActiveStatus(shownCards[1], itsamatch);

		// if there are no cards left in activeCards, you win!
		if (activeCards.length === 0) {
			youWin();
		}

		// remove disabled class from all cards
		removeClassesToAll(cards, 'disabled');

		// reset array with open cards
		openCards = [];

		// enable play
		disablePlay = false;

		// there are not matches anymore, so this is now false
		itsamatch = false;

		// remove the timer
		clearTimeout(pauseTimer);

	}, 1200);
}


/* Remove the card from the active game
 */
function removeActiveStatus (card, matches) {

	card.classList.remove('open', 'show', 'error');

	if (matches && openCards.length > 0) {
		let index = activeCards.indexOf(openCards[0]);
		activeCards.splice(index, 1);
		openCards.splice(0, 1);
	}

}


/* Substract 1 from the available moves left
 */
function substractOneMove () {

	let movesAmount = parseInt(movesNum.innerText);
	let stars = document.querySelectorAll('.stars > li');

	if (movesAmount > 0) {
		movesAmount -= 1;
	}

	if (stars.length > 0) {
		
		/* set all but the remaining stars to invisible
		 * to maintain their position
		 */
		for (var i=0; i < startingMoves; i++) {
			if (i+1 > movesAmount) {
				stars[i].style.visibility = 'hidden';
			}
		}
	}

	// Subtract 1 from the number shown
	movesNum.innerText = movesAmount;

	// and correct the wording accordingly
	movesText.innerText = (movesAmount === 1) ? 'Move' : 'Moves';

	/* if we've reached 0 moves available, well that's sad...
	 * the player lost, so disable play
	 */
	if (movesAmount === 0) {

		addClassesToAll(cards, 'disabled');
		disablePlay = true;

		// wait a bit before confronting the player with their defeat
		pauseTimer = setTimeout(function(){
			youLose();
			clearTimeout(pauseTimer);
		}, 2000);
	}
}


/* Add 1 move to the available moves left
 */
function addOneMove () {

	let movesAmount = parseInt(movesNum.innerText);
	let stars = document.querySelectorAll('.stars > li');

	movesNum.innerText = movesAmount + 1;

	// loop through stars until finding one with the visibility style
	for (var i=0; i < stars.length; i++) {
		if (stars[i].hasAttribute('style')) {
			// then remove this attribute and break out of loop
			stars[i].removeAttribute('style');
			break;
		}
	}
}


// perform a reset at the beginning
reset();

// add reset functionality to the button
resetButton.addEventListener('click', function(){
	reset();
});


/**************************************************************************************
 ************************** Supporting functions **************************************
 **************************************************************************************
 */

/* Shuffle function from http://stackoverflow.com/a/2450976
 */
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/* Function to add classes to a selection of elements at once
 */
function addClassesToAll(items, classname) {

	for (var i=0; i < items.length; i++) {
		items[i].classList.add(classname);
	}
}


/* Function to remove classes from a selection of elements at once
 */
function removeClassesToAll(items, classname) {

	for (var i=0; i < items.length; i++) {
		items[i].classList.remove(classname);
	}
}


/**************************************************************************************
 **************************** End game functions **************************************
 **************************************************************************************
 */

/* This is what happens when the player loses
 */
function youLose () {

	clearInterval(playTimer);

	// set display block but wait a bit for the transition
	endScreen.style.display = 'block';
	setTimeout(function() {
		// transition actived with class 'show'
		endScreen.classList.add('show');

		// Edit text in the ending screen
		endScreen.querySelector('h2').innerText = 'You lost the game!';
		endScreen.querySelector('p').innerText = 'You spend ' + movesMade + ' moves on it.';
	}, 200);
}


/* Show ending screen to end the game
 */
function youWin () {

	clearInterval(playTimer);

	// set text to display the amount of stars correctly
	let movesAmount = parseInt(movesNum.innerText);
	let movesEndText = (movesAmount > 1) ? 'stars' : 'star';

	// set display block but wait a bit for the transition
	endScreen.style.display = 'block';
	setTimeout(function() {
		// transition actived with class 'show'
		endScreen.classList.add('show');

		// Edit text in the ending screen
		endScreen.querySelector('h2').innerText = 'Congratulations! You won!';
		endScreen.querySelector('p').innerText = 'With ' + movesMade + ' moves and ' + movesAmount + ' ' + movesEndText + '!';
	}, 200);
}


// add event listener to the button for playing the game again
againButton.addEventListener('click', function() {

	// first reset everything before showing a new game
	reset();	

	// set display block but wait a bit for the transition
	endScreen.classList.remove('show');
	setTimeout(function() {

		// when transition is finished, we can change display
		endScreen.style.display = 'none';

		// reset texts of ending screen
		endScreen.querySelector('h2').innerText = '';
		endScreen.querySelector('p').innerText = '';
	}, 500);
});
