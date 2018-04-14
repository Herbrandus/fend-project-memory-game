/*
 * Create a list that holds all of your cards
 */

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

let activeCards = [];
let openCards = [];

let pauseTimer;
let disablePlay = false;

const resetButton = document.querySelector('.restart');
const deck = document.querySelector('ul.deck');

// empty deck
deck.innerHTML = '';

function reset() {

	console.log('reset!');

	let shuffledDeck = shuffle(allCardsArray);
	let deckHtml = '';
	activeCards = [];

	shuffledDeck.forEach(function(elem){
		let cardClass = cardIcons[elem];
	 	deckHtml += `
	 		<li class="card">
	 			<i class="fa ${cardClass}"></i>
			</li>`;

		activeCards.push(elem);
	});

	deck.innerHTML = deckHtml;

	console.log(activeCards);

	let cards = document.querySelectorAll('.card');

	for (var i=0; i<cards.length; i++) {

		cards[i].addEventListener('click', function(){
			if (!disablePlay) {
				openCard(this);
			}			
		});
	}
}

reset();

resetButton.addEventListener('click', function(){
	reset();
});

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

function openCard (elem) {
	console.log(elem);

	elem.classList.add('open', 'show');
	let innerClass = elem.querySelector('.fa');

	handleOpenCards(innerClass.classList);
}

function handleOpenCards (classList) {

	let openCardClass = classList.value;

	uniqueCardsArray.forEach(function(elem){
		let cardClass = cardIcons[elem];
		if (openCardClass.indexOf(cardClass) != -1) {
			openCards.push(elem);
		}
	});

	if (openCards.length === 2) {
		matchCards();
	}
}

function matchCards () {

	let shownCards = document.querySelectorAll('.card.open.show');
	let itsamatch = false;

	if (openCards[0] === openCards[1]) {
		shownCards[0].classList.add('match');
		shownCards[1].classList.add('match');
		itsamatch = true;
	} else {
		shownCards[0].classList.add('error');
		shownCards[1].classList.add('error');
	}

	disablePlay = true;
	pauseTimer = setTimeout(function(){

		removeActiveStatus(shownCards[0], itsamatch);

		if (activeCards.length === 0) {
			console.log('you won!');
		}

		openCards = [];
		disablePlay = false;

	}, 1200);
}

function removeActiveStatus (card, matches) {

	card.classList.remove('open', 'show', 'error');

	if (matches) {
		openCards.forEach(function(item) {
			let index = activeCards.indexOf(item);
			activeCards.splice(index, 1);
		});
	}

	console.log(activeCards);
}

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
