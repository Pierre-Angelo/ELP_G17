const prompt = require("prompt-sync")();
const fs = require('fs')
const player = require('.\\Player.js')
const word_verif = require('.\\WordVerif.js')
const end = require('.\\End.js')

const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P','Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
// pour tester draw : const combien = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
const combien = [14, 4, 7, 5, 19, 2, 4, 2, 11, 1, 1, 6, 5, 9, 8, 4, 1, 10, 7, 9, 8, 2, 1, 1, 1, 2];

let listOfLetters = [];


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
	}
	else {
		console.log("0 pour piocher ou 1 pour remplacer 3 lettres : ");
		let decision = prompt("");
		while ((decision != '0') && (decision != '1')) {
			console.log("Mauvaise réponse.");
			console.log("0 pour piocher ou 1 pour remplacer 3 lettres : ");
			decision = prompt("");
		}		
		if (decision == 0) {
			let framboise = drawLetter()
			player.letters.push(framboise);
			console.log("Vous avez tirez la lettre " + framboise);
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
				let framboise = drawLetter()
				player.letters.push(framboise);
				console.log("Vous avez tirez la lettre " + framboise);
			}
		}
	}
};

//remplace trois lettres du player avec trois de la draw
function switchLetters (player) {
	let echange = [];
	for (let i = 0; i < 3 ; i++) {
		console.log("Choisissez la " + (i + 1) + "eme lettre.");
		let alors = prompt("");
		while (!(inIt(alors, player.letters))) {
			console.log("Vous ne possédez pas cette lettre.");
			console.log("Tapez une autre lettre.");
			alors = prompt("");
		}
		echange.push(alors);
		player.letters = remove(player.letters, player.letters.indexOf(alors));
	}
	for (let i = 0; i < 3 ; i++) {
		let pasteque = drawLetter();
		console.log("Vous avez pioché " + pasteque);
		player.letters.push(pasteque);
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

function putWord (player,g_log){
	let word = activePlayer.enter_word();
	let verification = word_verif.verif(word, activePlayer.letters);
	while (!verification) {
		word = activePlayer.enter_word();
		verification = word_verif.verif(word, activePlayer.letters);
	}
	player.carpet.push(word);
	g_log = g_log  + "joueur " + player.id + " : "  + word + "\n"
	let wordLettersList = word_verif.str_to_tab(word);
	for (let i = 0 ; i < wordLettersList.length; i++) {
		player.letters = remove(player.letters, player.letters.indexOf(wordLettersList[i]));
	}
	return g_log
}

function jump_line(nb) {
	for (i = 0 ; i< nb ; i++) {
		console.log("");
	}
}

function actionOfPlayer (player, otherPlayer){

	let decision = 0;	

	if ((player.carpet.length <= 0) && (player.letters.length < 3)){
		decision = 0;
	}

	else if (player.letters.length < 3) {
		console.log("Voulez vous modifier un mot dèjà placé [1] ou passer votre tour [2] ?");
		decision = prompt("");
		while ((decision != '1') && (decision != '2')) {
			console.log("Mauvaise réponse.");
			console.log("1 pour modifier un mot, 2 pour passer votre tour: ");
			decision = prompt("");
		}
	}

	else if (player.carpet.length <= 0) {
		console.log("Voulez vous poser un mot [0] ou passer votre tour [2] ?");
		decision = prompt("");
		while ((decision != '0') && (decision != '2')) {
			console.log("Mauvaise réponse.");
			console.log("0 pour poser un mot, 2 pour passer votre tour: ");
			decision = prompt("");
		}
	}

	else {
		console.log("Voulez vous poser un mot [0], modifier un mot dèjà placé [1] ou passer votre tour [2] ?");
		decision = prompt("");
		while ((decision != '0') && (decision != '1') && (decision != '2')) {
			console.log("Mauvaise réponse.");
			console.log("0 pour poser un mot, 1 pour modifier un mot, 2 pour passer votre tour: ");
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
	}
	console.log("Voici votre nouveau tapis : ");
	player.disp_carpet();
}


function changeAWord(player, otherPlayer) {
	console.log("Quel mot voulez-vous changer? (0, 1, 2, 3, ...)");
	let decision = prompt ("");
	while (decision >= player.carpet.length) {
		console.log("Il n'y a pas de mot à modifier à cet endroit.");
		console.log("Quel mot voulez vous changer? (0, 1, 2, 3, ...)");
		decision = prompt("");
	}

	console.log("Voici vos lettres : ");
	player.disp_letters();

	let initial = word_verif.str_to_tab(player.carpet[decision]);
	let word = player.enter_word();
	
	while (!(hasSameLetters(initial, word_verif.str_to_tab(word))) && (!(siblings(initial, word_verif.str_to_tab(word))))) {
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
	}
	else{
		player.carpet.push(word);
	}
	let wordLettersList = word_verif.str_to_tab(word);

	for (let i = 0 ; i < wordLettersList.length; i++) {
		if (!(inIt(wordLettersList[i], initial))) {
			player.letters = remove(player.letters, player.letters.indexOf(wordLettersList[i]));
		}
	}
}


function siblings (initWordList, givenWordList) {
	let indeed = true ;
	if (!((initWordList.length == givenWordList.length)) && (!(hasSameLetters(initWordList, givenWordList)))) {
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
		console.log("Voulez-vous arnaquer votre adversaire? [1] => oui, [0] => non");
		let answer = prompt("");
		if (answer == 1) {
			jump_line(2);
			console.log("JARNAC!");
			jump_line(2);
			changeAWord(otherPlayer, player)
			// revient à modifier le mot mais en le donnant à l'autre joueur
		}
	}
}

function game () {
	fillList(combien, alphabet); //initialisation : remplit la draw
	let game_log = "";
	let player1 = player.create_player(1);
	let player2 = player.create_player(2);
	let partie = [player1, player2];
	let tour = 0;
	while (end.is_still_going(player1.carpet, player2.carpet, listOfLetters)) {
		activePlayer = partie[tour % 2] ;
		jump_line(9);
		console.log("joueur " + ((tour % 2) + 1) + ", c'est votre tour :");
		jarnac(activePlayer, tour, partie[(tour + 1) % 2]);
		activePlayer.disp_carpet();
		jump_line(1);
		activePlayer.disp_letters();
		//jump_line(2);
		drawTurn(tour, activePlayer);
		jump_line(3);
		activePlayer.disp_letters();
		jump_line(1);
		actionOfPlayer(activePlayer, 0);
		tour = tour + 1;
	}
	console.log("Fin de partie au bout de " + Math.round(tour/2) + " tours.");
	console.log(end.winner(player1.carpet, player2.carpet));
	console.log("Scores :")
	console.log("Joueur 1 : " + end.score(player1.carpet))
	console.log("Joueur 2 : " + end.score(player2.carpet))

	return game_log
}

 

g_log = game();

fs.writeFile('log_words.txt', g_log, (err) => {
	if (err) throw err;
})

//console.log(listOfLetters);