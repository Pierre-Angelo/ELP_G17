const prompt = require("prompt-sync")();
const fs = require('fs')
const player = require('.\\Player.js')
const word_verif = require('.\\WordVerif.js')
const end = require('.\\End.js')

const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P','Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
// pour tester draw : const combien = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
const combien = [14, 4, 7, 5, 19, 2, 4, 2, 11, 1, 1, 6, 5, 9, 8, 4, 1, 10, 7, 9, 8, 2, 1, 1, 1, 2];

let listOfLetters = [];
let game_log = ""

//Afin d'initialiser la draw des lettres
function fillList(number, letter){
	for (let j = 0; j < number.length ; j++) {
		for (let i = 0; i < number[j]; i ++) {
			listOfLetters.push(letter[j]);
		}
	}
};

//renvoie une liste auquelle on a enlèvé une lettre à index
function remove(list, index) {
	return list.slice(0, index).concat(list.slice(index + 1));
};

//draw une lettre au hasard dans la draw
function drawLetter () {
	let rand = Math.round(Math.random()*(listOfLetters.length - 1));
	let take = listOfLetters[rand];
	listOfLetters = remove(listOfLetters, rand);
	return take;
};


function drawTurn (tour, player){
	if ((tour == 0) || (tour == 1)){	//dépend de comment on implémente tour
		for (let i =0 ; i < 6 ; i++) {
			let io = drawLetter();
			player.letters.push(io);
		}
		console.log("Vous avez pioché six fois.");
		game_log = game_log + "Le joueur " + player.id + " commence avec : " + player.letters.toString() + ".\n" ;
	}
	else {
		if (tour == -5) {
			let dragonFruit = drawLetter();
			player.letters.push(dragonFruit);
			console.log("Vous piochez la lettre : " + dragonFruit);
			game_log = game_log + "Le joueur " + player.id + " pioche : " + dragonFruit +".\n" ;
		}
		else {
			console.log("[0] pour piocher ou [1] pour remplacer 3 lettres : ");
			let decision = prompt("");
			while ((decision != '0') && (decision != '1')) {
				console.log("Mauvaise réponse.");
				console.log("[0] pour piocher ou [1] pour remplacer 3 lettres : ");
				decision = prompt("");
			}		
			if (decision == 0) {
				let raspberry = drawLetter()
				player.letters.push(raspberry);
				console.log("Vous avez tirez la lettre " + raspberry);
				game_log = game_log + "Le joueur " + player.id + " pioche : " + raspberry +".\n" ;
			}
			else if (decision == 1) {
				if (player.letters.length >= 3) {
					console.log("Vous avez décidé de remplacer trois lettres.");
					switchLetters(player);
				}
				else {
					console.log("Vous n'avez pas au moins trois lettres à échanger...");
					console.log("Vous allez piocher à la place.");
					console.log("");
					let kiwi = drawLetter()
					player.letters.push(kiwi);
					console.log("Vous avez tirez la lettre " + kiwi);
					game_log = game_log + "Le joueur " + player.id + " pioche : " + kiwi ;
				}
			}
		}
	}
};

//remplace trois lettres du player avec trois de la draw
function switchLetters (player) {
	let echange = [];
	for (let i = 0; i < 3 ; i++) {
		console.log("Choisissez la " + (i + 1) + "eme lettre.");
		let alors = prompt("").toUpperCase();
		while (!(inIt(alors, player.letters))) {
			console.log("Vous ne possédez pas cette lettre.");
			console.log("Tapez une autre lettre.");
			alors = prompt("").toUpperCase;
		}
		echange.push(alors);
		discardedLetter = player.letters.indexOf(alors)
		player.letters = remove(player.letters, player.letters.indexOf(alors));
	}
	for (let i = 0; i < 3 ; i++) {
		let watermelon = drawLetter();
		console.log("Vous avez pioché " + watermelon);
		player.letters.push(watermelon);
		game_log = game_log + "Le joueur" + player.id + "échange " + discardedLetter + " pour " + watermelon + ".\n" ;
	}
	for (let i = 0; i < 3 ; i++) {
		listOfLetters.push(echange[i])
	}
}

//verifie si élement "caractère" est dans la liste donnée
function inIt (car, liste) {
	let res = false;
	for (let i = 0 ; i < liste.length ; i++){
		if (car == liste[i]) {
			res = true;
		}
	}
	return res;
}

function putWord (player){
	let word = activePlayer.enter_word();
	let verification = word_verif.verif(word, activePlayer.letters);
	while (!verification) {
		word = activePlayer.enter_word();
		verification = word_verif.verif(word, activePlayer.letters);
	}
	player.carpet.push(word);
	game_log = game_log  + "joueur " + player.id + " ajoute : "  + word + ".\n"
	let wordLettersList = word_verif.str_to_tab(word);
	for (let i = 0 ; i < wordLettersList.length; i++) {
		player.letters = remove(player.letters, player.letters.indexOf(wordLettersList[i]));
	}
}

function jump_line(nb) {
	for (i = 0 ; i< nb ; i++) {
		console.log("");
	}
}

function actionOfPlayer (player, otherPlayer){

	let decision = 0;	

	if ((player.carpet.length <= 0) && (player.letters.length < 3)){
		decision = 2;
	}

	else if (player.letters.length < 3) {
		console.log("Voulez vous modifier un mot dèjà placé [1] ou passer votre tour [2] ?");
		decision = prompt("");
		while ((decision != '1') && (decision != '2')) {
			console.log("Mauvaise réponse.");
			console.log("[1] pour modifier un mot, [2] pour passer votre tour: ");
			decision = prompt("");
		}
	}

	else if (player.carpet.length <= 0) {
		console.log("Voulez vous poser un mot [0] ou passer votre tour [2] ?");
		decision = prompt("");
		while ((decision != '0') && (decision != '2')) {
			console.log("Mauvaise réponse.");
			console.log("[0] pour poser un mot, [2] pour passer votre tour: ");
			decision = prompt("");
		}
	}

	else {
		console.log("Voulez vous poser un mot [0], modifier un mot dèjà placé [1] ou passer votre tour [2] ?");
		decision = prompt("");
		while ((decision != '0') && (decision != '1') && (decision != '2')) {
			console.log("Mauvaise réponse.");
			console.log("[0] pour poser un mot, [1] pour modifier un mot, [2] pour passer votre tour: ");
			decision = prompt("");
		}
	}
	
	if (decision == 0){
		putWord(player);
	}
	else if (decision == 1) {
		console.log("Vous voulez changer un mot sur votre tapis:");
		player.disp_carpet();
		changeAWord(player, otherPlayer);
	}
	else {
		console.log("Vous passez votre tour.");
		decision = 2;
	}
	console.log("Voici votre nouveau tapis : ");
	player.disp_carpet();
	return decision;
}


function changeAWord(player, otherPlayer) {
	console.log("Quel mot voulez-vous changer? (0, 1, 2, 3, ...)");
	let decision = parseInt(prompt (""));
	while ((decision >= player.carpet.length) || (decision != decision)) {
		console.log("Il n'y a pas de mot à modifier à cet endroit.");
		console.log("Quel mot voulez vous changer? (0, 1, 2, 3, ...)");
		decision = parseInt(prompt(""));
	}

	player.disp_letters();

	let initial = word_verif.str_to_tab(player.carpet[decision]);
	let word = player.enter_word();
	
	while (hasSameLetters(initial, word_verif.str_to_tab(word)) != (siblings(initial, word_verif.str_to_tab(word)))) {
		word = player.enter_word();
		// tant que le mot est identique ou ne possède pas toutes les lettres du mot
	}
	
	let possibleLetters = []
	possibleLetters = copy(possibleLetters, player.letters);

	for (let i = 0; i< player.carpet[decision].length; i++){
		possibleLetters.push(player.carpet[decision][i]);
	}

	let verification = word_verif.verif(word, possibleLetters);
	while (!verification) {
		word = player.enter_word();
		verification = word_verif.verif(word, possibleLetters);
	}
	
	player.carpet = remove(player.carpet, decision);
	if (otherPlayer != 0) {
		otherPlayer.carpet.push(word);
		game_log = game_log  + "joueur " + otherPlayer.id + " (j)arnaque le mot "+ decision+" et ajoute : "  + word + ".\n"
	}
	else{
		player.carpet.push(word);
		game_log = game_log  + "joueur " + player.id + " change le mot "+ decision+" : "  + word + ".\n"
	}
	let wordLettersList = word_verif.str_to_tab(word);

	let toSubstract = substract(initial, wordLettersList);	

	for (let i = 0 ; i < toSubstract.length; i++) {
		if (toSubstract[i] != undefined) {
			player.letters = remove(player.letters, player.letters.indexOf(toSubstract[i]));
		}
	}
}


function substract(wordInit, wordGiven) {
	let manguo = [];
	manguo = copy(manguo, wordGiven);
	for (let i = 0 ; i < wordGiven.length; i++) {
		if ((inIt(wordGiven[i], wordInit)) && (wordGiven[i] != undefined)) {
			wordInit = remove(wordInit, wordInit.indexOf(wordGiven[i]));
			manguo = remove(manguo, manguo.indexOf(wordGiven[i]));
		}
	}
	return manguo;	
}

function siblings (initWordList, givenWordList) {
	let indeed = true ;
	if (((initWordList.length == givenWordList.length) && (hasSameLetters(initWordList, givenWordList)))) {
		indeed = false;
	}
	return indeed ;
}

function hasSameLetters (initWordList, givenWordList) {
	let indeed = true ;
	let temp = [];
	temp = copy(temp, givenWordList);
	for (let i = 0 ; i <= initWordList.length ; i ++) {
		if (!(inIt(initWordList[i], temp))) {
			indeed = false ;
		}
		else {
			temp = remove(temp, temp.indexOf(initWordList[i]));
		}
	}
	return indeed ;
}

function copy(emptyLi, fullLi) {
	for (let i =0 ; i <= fullLi.length ; i++) {
		emptyLi.push(fullLi[i]);
	}
	return emptyLi;
}

function jarnac (player, tour, otherPlayer) {
	if (otherPlayer.carpet.length > 0) {
		let answer = -1;
		console.log("Voulez-vous (j)arnaquer votre adversaire? [1] => oui, [0] => non");
		console.log("Vous avez 3 secondes pour vous décider.")
		let time_ini = Date.now();
		while (answer == -1) {
			answer = prompt("");
			let time_prompt = Date.now();
			if ((time_prompt - time_ini) < 3000) {
				if (answer == 1) {
					jump_line(2);
					console.log("JARNAC!");
					jump_line(2);
					changeAWord(otherPlayer, player);
					// revient à modifier le mot mais en le donnant à l'autre joueur
				} else if (answer == 0) {
					console.log("");
				} else {
					answer = -1
					console.log("[1] => faire un coup du Jarnac, [0] => ne rien faire");
				}
			} else {
				answer = 0
				console.log("Limite de temps écoulée")
			}
		}
	}
}

function game () {
	fillList(combien, alphabet); //initialisation : remplit la draw;
	let player1 = player.create_player(1);
	let player2 = player.create_player(2);
	let partie = [player1, player2];
	let tour = 0;
	let playAgain = 0;
	while (end.is_still_going(player1.carpet, player2.carpet, listOfLetters)) {
		activePlayer = partie[tour % 2] ;
		jump_line(9);
		console.log("joueur " + ((tour % 2) + 1) + ", c'est votre tour :");
		jarnac(activePlayer, tour, partie[(tour + 1) % 2]);
		activePlayer.disp_carpet();
		jump_line(1);
		activePlayer.disp_letters();
		drawTurn(tour, activePlayer);
		jump_line(3);
		activePlayer.disp_letters();
		jump_line(1);
		playAgain = actionOfPlayer(activePlayer, 0);
		while ((playAgain != 2) && (end.is_still_going(player1.carpet, player2.carpet, listOfLetters))) {
			drawTurn(-5, activePlayer);
			jump_line(3);
			activePlayer.disp_letters();
			jump_line(1);
			playAgain = actionOfPlayer(activePlayer, 0);
		}
		tour = tour + 1;
	}
	console.log("Fin de partie au bout de " + Math.round(tour/2) + " tours.");
	console.log(end.winner(player1.carpet, player2.carpet));
	game_log = game_log + end.winner(player1.carpet, player2.carpet) + "\n"
	console.log("Scores :")
	console.log("Joueur 1 : " + end.score(player1.carpet))
	console.log("Joueur 2 : " + end.score(player2.carpet))
	game_log = game_log + "Score du Joueur 1 : " + end.score(player1.carpet) + "\n"
	game_log = game_log + "Score du Joueur 2 : " + end.score(player2.carpet) + "\n"
}

 

game();

fs.writeFile('log_game.txt', game_log, (err) => {
	if (err) throw err;
})

//console.log(listOfLetters);