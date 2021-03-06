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

const startingStars = 3;

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

let movesText = document.querySelector('.movesText');
let starsContainer = document.querySelector('.stars');
let displayTimer = document.getElementById('timer');
let movesCounter = document.querySelector('.moves');


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
	starsAmount = startingStars;
	winningSpree = 0;
	failedMatches = 0;
	activeCards = [];
	openCards = [];
	disablePlay = false;
	seconds = 0;
	minutes = 0;
	let c = 1;

	clearInterval(playTimer);

	let deckHtml = '';

	shuffledDeck.forEach(function(elem){
		let cardClass = cardIcons[elem];
	 	deckHtml += '<li class="card" tabindex="'+c+'">' +
	 			'<i class="fa ' + cardClass + '"></i>' +
				'</li>';

		activeCards.push(elem);

		c++;
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
	
	for (var i=0; i < startingStars; i++) {
		newStarsHtml += '<li><i class="fa fa-star"></i></li>';
	}

	starsContainer.innerHTML = newStarsHtml;

	// reset amount of moves to be made
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

	// without this you can click the same card for a match
	if (!elem.classList.contains('show')) {

		elem.classList.add('open');
		setTimeout(function(){
			elem.classList.add('show');
			let innerClass = elem.querySelector('.fa');

			handleOpenCards(innerClass.classList);
		}, 150);
	}	
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
		setTimeout(function(){
			matchCards();
		}, 150);
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
		if (failedMatches === 3) {
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
		card.removeAttribute('tabindex');
	}

}


/* Substract 1 from the available moves left
 */
function substractOneMove () {

	if (starsAmount > 1) {
		starsAmount -= 1;
	}

	let stars = document.querySelectorAll('.stars > li');

	if (stars.length > 0) {
		
		/* set all but the remaining stars to invisible
		 * to maintain their position
		 */
		for (var i=0; i < startingStars; i++) {
			if (starsAmount === 2) {
				stars[2].style.visibility = 'hidden';
			} else if (starsAmount === 1) {
				stars[1].style.visibility = 'hidden';
				stars[2].style.visibility = 'hidden';
			}
		}
	}

}


// perform a reset at the beginning
reset();

// add reset functionality to the button
resetButton.addEventListener('click', function(){
	reset();
});

document.addEventListener('keydown', function(evt){

	for (let i=0; i<cards.length; i++) {

		if (cards[i] === document.activeElement) {
			
			if (evt.which == 13) {
				
				if (!cards[i].classList.contains('match') && !disablePlay) {

					openCard(cards[i]);

				}

			}
		}
	}
});


/**************************************************************************************
 ************************** Supporting functions **************************************
 **************************************************************************************
 */

/* 	Written my own shuffle method! 
 *	Previously:
 * 	Shuffle function from http://stackoverflow.com/a/2450976
 */
function shuffle(array) {
    
    let num = array.length;
	let numArray = [];
	let newArray = [];
	let newNum;

	for (let i=0; i<num; i++) {

		newNum = Math.floor(Math.random() * num);
		
		if (i > 0) {
			while (numArray.indexOf(newNum) !== -1) {
				newNum = Math.floor(Math.random() * num);
			}
		}

		numArray.push(newNum);
	}

	for (let j=0; j<num; j++) {

		newArray.push( array[ numArray[j] ] );
	}

	return newArray;
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


/* Show ending screen to end the game
 */
function youWin () {

	clearInterval(playTimer);

	// set text to display the amount of stars correctly
	let movesEndText = (starsAmount > 1) ? 'stars' : 'star';

	// set text for the time it took to finish the game
	let timeLabelEndText = (minutes > 0) ? minutes + ' minutes and ' + seconds + ' seconds' : seconds + ' seconds';

	// fun message at the end depending on the remaining amount of stars
	let hyperbole = 'Very good!';
	if (starsAmount === 2) {
		hyperbole = 'Awesome!';
	} else if (starsAmount === 3) {
		hyperbole = 'Fantastich job!!';
	}

	// set display block but wait a bit for the transition
	endScreen.style.display = 'block';
	setTimeout(function() {
		// transition actived with class 'show'
		endScreen.classList.add('show');

		// Edit text in the ending screen
		endScreen.querySelector('h2').innerText = 'Congratulations! You won!';
		endScreen.querySelector('p').innerHTML = 'It took you ' + movesMade + ' moves during a time of ' + timeLabelEndText + '.<br>' + starsAmount + ' ' + movesEndText + ' remaining! ' + hyperbole;
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
