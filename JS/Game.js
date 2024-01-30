const prompt = require("prompt-sync")();
const fs = require('fs')
const player = require('.\\Player.js')

const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P','Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
// pour tester draw : const combien = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
const combien = [14, 4, 7, 5, 19, 2, 4, 2, 11, 1, 1, 6, 5, 9, 8, 4, 1, 10, 7, 9, 8, 2, 1, 1, 1, 2];

let listOfLetters = [];


const str_to_tab = function (x){ //transform word into list of letters
    return x.split('');
}

const add_letter = function(l, letters) {
    let added = false;
    for (let i = 0; i < letters.length; i++) {
        if (letters[i][0] === l) {
            letters[i][1]++;
            added = true
        }
    }
    if (added === false){
        letters.push([l, 1]);
    }
}

const possibilities = function(letters) { //ajoute chaque lettre(liste) ds une autre liste
    let res = [];
    for (let i = 0; i < letters.length; i++) {
        add_letter(letters[i], res);
    }
    return res;
}

const letter_verification = function(l, letters) {
    let res = false;
    for (let i = 0; i < letters.length; i++) {
        if ((letters[i][0] === l) && (letters[i][1] > 0)) {
            letters[i][1]--;
            res = true;
        }
    }
    return res;
}

const word_verification = function (w, letters) {// paramètres : liste, liste
    let poss = possibilities(letters);
    let res = true;
    for (let i = 0; i < w.length; i++) { //pour chaque lettre du mot donné
        if (letter_verification(w[i], poss) === false) {
            res = false;
        }
    }
    return res;
}

const verif = function (word, letters) {
    if ((word.length < 3) || (word.length > 9)) { //si word trop long ou trop petit => non
        return false
    } else {
        return word_verification(str_to_tab(word), letters) //sinon vérifie si possible
    }
}


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


function tourDedraw (tour, player){
	if ((tour == 0) || (tour == 1)){	//dépend de comment on implémente tour
		for (let i =0 ; i < 6 ; i++) {
			let io = drawLetter();
			player.letters.push(io);
		}
	}
	else {
		console.log("0 pour draw ou 1 pour remplacer 3 lettres : ");
		let decision = prompt("");
		while ((decision != '0') && (decision != '1')) {
			console.log("Mauvaise réponse.");
			console.log("0 pour draw ou 1 pour remplacer 3 lettres : ");
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
				console.log("Vous allez drawr à la place.");
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

function putWord (player){
	let word = activePlayer.enter_word();
	let verification = verif(word, activePlayer.letters);
	while (!verification) {
		word = activePlayer.enter_word();
		verification = verif(word, activePlayer.letters);
	}
	player.carpet.push(word);
	data = "player " + player.id + " : "  + word
	fs.writeFile('log_words.txt', data, (err) => {
		if (err) throw err;
	})
	let wordLettersList = str_to_tab(word);
	for (let i = 0 ; i < wordLettersList.length; i++) {
		player.letters = remove(player.letters, player.letters.indexOf(wordLettersList[i]));
	}
}

function jump_line(nb) {
	for (i = 0 ; i< nb ; i++) {
		console.log("");
	}
}

function game () {
	fillList(combien, alphabet); //initialisation : remplit la draw
	let player1 = player.create_player(1);
	let player2 = player.create_player(2);
	let partie = [player1, player2];
	let tour = 0;
	while ((player1.carpet.length < 8) && (player2.carpet.length < 8) && (listOfLetters.length > 0)) {
		activePlayer = partie[tour % 2] ;
		jump_line(6);
		console.log("joueur " + ((tour % 2) + 1) + ", c'est votre tour :");
		activePlayer.disp_carpet();
		jump_line(1);
		activePlayer.disp_letters
		jump_line(2);
		tourDedraw(tour, activePlayer);
		jump_line(3);
		activePlayer.disp_letters();
		jump_line(1);
		if (activePlayer.letters.length >= 3) {
			putWord(activePlayer);
			console.log("Voici votre nouveau tapis : ");
			console.log(activePlayer.carpet);
		}
		tour = tour + 1;
	}
	console.log("Fin de partie au bout de " + Math.round(tour/2) + " tours.");
	console.log("Le joueur " + (((tour-1) % 2) + 1) + " a gagné.");
}

game();

//console.log(listOfLetters);