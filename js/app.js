/*
 * Create a list that holds all of your cards
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

// object linking the array names for each card
// with the class names used to display them
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
let winningSpree;

// these variables are used to disable play while
// the animations are playing
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


/**************************************************************************************
 ******************************** Game functions **************************************
 **************************************************************************************
 */

// reset the game to start again
// Used for the reset button at the top and for the 'play again' button at the end
function reset() {

	// empty deck at first
	deck.innerHTML = '';

	// shuffle the deck
	let shuffledDeck = shuffle(allCardsArray);
	
	// reset all starting variables
	movesMade = 0;
	winningSpree = 0;
	activeCards = [];
	openCards = [];
	disablePlay = false;

	let deckHtml = '';

	shuffledDeck.forEach(function(elem){
		let cardClass = cardIcons[elem];
	 	deckHtml += `
	 		<li class="card">
	 			<i class="fa ${cardClass}"></i>
			</li>`;

		activeCards.push(elem);
	});

	deck.innerHTML = deckHtml;

	// now that the deck is shuffled and the cards are
	// in the DOM, store them in this variable
	cards = document.querySelectorAll('.card');

	// add the event listeners to all cards in the game
	for (var i=0; i<cards.length; i++) {

		cards[i].addEventListener('click', function(){
			// only allow the function when there is no 
			// animation playing or defeat
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
	
}

reset();

resetButton.addEventListener('click', function(){
	reset();
});


// this function is called when clicking on a card
function openCard (elem) {

	elem.classList.add('open', 'show');
	let innerClass = elem.querySelector('.fa');

	handleOpenCards(innerClass.classList);
}


// check if there are more cards than 1 opened
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


// function for matching the cards that are open
function matchCards () {

	let shownCards = document.querySelectorAll('.card.open.show');
	let itsamatch;

	// when both open cards are the same
	// show the player it's a match!
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

		// remove a star from the total amount
		substractOneMove();
		winningSpree = 0;
	}

	// disable the cards visibly by adding a class
	// to be removed again after the timeOut
	addClassesToAll(cards, 'disabled');

	// update the amount of moves made
	movesMade++;

	// if the player has 3 correct guesses in a row
	// reward him by returning 1 lost star
	if (winningSpree === 3) {
		addOneMove();
		winningSpree = 0;
	}

	disablePlay = true;
	pauseTimer = setTimeout(function(){

		// deactivate the opened cards
		removeActiveStatus(shownCards[0], itsamatch);
		removeActiveStatus(shownCards[1], itsamatch);

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


// Remove the card from the active game
function removeActiveStatus (card, matches) {

	card.classList.remove('open', 'show', 'error');

	if (matches && openCards.length > 0) {
		let index = activeCards.indexOf(openCards[0]);
		activeCards.splice(index, 1);
		openCards.splice(0, 1);
	}

}


// Substract 1 from the available moves left
function substractOneMove () {

	let movesAmount = parseInt(movesNum.innerText);
	let stars = document.querySelectorAll('.stars > li');

	if (movesAmount > 0) {
		movesAmount -= 1;
	}

	if (stars.length > 0) {
		
		// set all but the remaining stars to invisible
		// to maintain their position
		for (var i=0; i < startingMoves; i++) {
			if (i+1 > movesAmount) {
				stars[i].style.visibility = 'hidden';
			}
		}
	}

	// Subtract 1 from the number shown
	movesNum.innerText = movesAmount;

	// and correct the wording accordingly
	if (movesAmount === 1) {
		movesText.innerText = 'Move';
	} else {
		movesText.innerText = 'Moves';
	}

	// if we've reached 0 moves available, well that's sad...
	// the player lost, so disable play
	if (movesAmount === 0) {

		disablePlay = true;

		// wait a bit before confronting the player with their defeat
		pauseTimer = setTimeout(function(){
			youLose();
			clearTimeout(pauseTimer);
		}, 2000);
	}
}


// Add 1 move to the available moves left
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

/**************************************************************************************
 ************************** Supporting functions **************************************
 **************************************************************************************
 */

// Shuffle function from http://stackoverflow.com/a/2450976
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


// Function to add classes to a selection of elements at once
function addClassesToAll(items, classname) {

	for (var i=0; i < items.length; i++) {
		items[i].classList.add(classname);
	}
}


// Function to remove classes from a selection of elements at once
function removeClassesToAll(items, classname) {

	for (var i=0; i < items.length; i++) {
		items[i].classList.remove(classname);
	}
}


/**************************************************************************************
 **************************** End game functions **************************************
 **************************************************************************************
 */

function youLose () {

	endScreen.style.display = 'block';
	setTimeout(function(){
		endScreen.classList.add('show');
		endScreen.querySelector('h2').innerText = 'You lost the game!';
		endScreen.querySelector('p').innerText = 'You spend ' + movesMade + ' moves on it.';
	}, 200);
}

function youWin () {

	let movesEndText = '';
	let movesAmount = parseInt(movesNum.innerText);
	if (movesAmount > 1) {
		movesEndText = 'stars';
	} else {
		movesEndText = 'star';
	}

	endScreen.style.display = 'block';
	setTimeout(function(){
		endScreen.classList.add('show');
		endScreen.querySelector('h2').innerText = 'Congratulations! You won!';
		endScreen.querySelector('p').innerText = 'With ' + movesMade + ' moves and ' + movesAmount + ' ' + movesEndText + '!';
	}, 200);
}

againButton.addEventListener('click', function() {

	reset();	

	endScreen.classList.remove('show');
	setTimeout(function(){
		endScreen.style.display = 'none';
		endScreen.querySelector('h2').innerText = '';
		endScreen.querySelector('p').innerText = '';
	}, 500);
});

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
