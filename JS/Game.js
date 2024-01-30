const prompt = require("prompt-sync")();
const fs = require('fs')

const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P','Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
// pour tester pioche : const combien = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
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




function cree_joueur(){
    joueur = {
        tapis : [], // contient des mots
        lettres : [], //contient des caractères
        aff_tapis : function(){
            res = "      9  16 25 36 49 64 81\n"
            for(mot of this.tapis){
                for (lettre of mot){
                    res += lettre + "  "
                }
                res += "\n";
            }
            console.log(res)
        },
        aff_lettres : function(){
            res = "Voici vos lettre à disposition : "
            for (lettre of this.lettres){
                res += lettre + " ";
            }
            console.log(res);
        },
        entrer_mot :  function(){
            return prompt("Entrez votre mot : ");
        }
    
    }

    return joueur
}

//Afin d'initialiser la pioche des lettres
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

//Pioche une lettre au hasard dans la pioche
function piocheLetter () {
	let rand = Math.round(Math.random()*(listOfLetters.length - 1));
	let take = listOfLetters[rand];
	listOfLetters = remove(listOfLetters, rand);
	return take;
};


function tourDePioche (tour, joueur){
	if ((tour == 0) || (tour == 1)){	//dépend de comment on implémente tour
		for (let i =0 ; i < 6 ; i++) {
			let io = piocheLetter();
			joueur.lettres.push(io);
		}
	}
	else {
		console.log("0 pour pioche ou 1 pour remplacer 3 lettres : ");
		let decision = prompt("");
		while ((decision != '0') && (decision != '1')) {
			console.log("Mauvaise réponse.");
			console.log("0 pour pioche ou 1 pour remplacer 3 lettres : ");
			decision = prompt("");
		}		
		if (decision == 0) {
			let framboise = piocheLetter()
			joueur.lettres.push(framboise);
			console.log("Vous avez tirez la lettre " + framboise);
		}
		else if (decision == 1) {
			if (joueur.lettres.length >= 3) {
				console.log("Vous avez décidé de remplacer trois lettres.");
				switchLetters(joueur);
			}
			else {
				console.log("Vous n'avez pas au moins trois lettres à échanger...");
				console.log("Vous allez piocher à la place.");
				console.log("");
				let framboise = piocheLetter()
				joueur.lettres.push(framboise);
				console.log("Vous avez tirez la lettre " + framboise);
			}
		}
	}
};

//remplace trois lettres du joueur avec trois de la pioche
function switchLetters (joueur) {
	let echange = [];
	for (let i = 0; i < 3 ; i++) {
		console.log("Choisissez la " + (i + 1) + "eme lettre.");
		let alors = prompt("");
		while (!(inIt(alors, joueur.lettres))) {
			console.log("Vous ne possédez pas cette lettre.");
			console.log("Tapez une autre lettre.");
			alors = prompt("");
		}
		echange.push(alors);
		joueur.lettres = remove(joueur.lettres, joueur.lettres.indexOf(alors));
	}
	for (let i = 0; i < 3 ; i++) {
		let pasteque = piocheLetter();
		console.log("Vous avez pioché " + pasteque);
		joueur.lettres.push(pasteque);
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

function putWord (joueur){
	let word = joueurActif.entrer_mot();
	let verification = verif(word, joueurActif.lettres);
	while (!verification) {
		word = joueurActif.entrer_mot();
		verification = verif(word, joueurActif.lettres);
	}
	joueur.tapis.push(word);
	data = "joueur " + player.id + " : "  + word
	fs.writeFile('log_words.txt', data, (err) => {
		if (err) throw err;
	})
	let wordLettersList = str_to_tab(word);
	for (let i = 0 ; i < wordLettersList.length; i++) {
		joueur.lettres = remove(joueur.lettres, joueur.lettres.indexOf(wordLettersList[i]));
	}
}

function jump_line(nb) {
	for (i = 0 ; i< nb ; i++) {
		console.log("");
	}
}

function game () {
	fillList(combien, alphabet); //initialisation : remplit la pioche
	let joueur1 = cree_joueur();
	let joueur2 = cree_joueur();
	let partie = [joueur1, joueur2];
	let tour = 0;
	while ((joueur1.tapis.length < 8) && (joueur2.tapis.length < 8) && (listOfLetters.length > 0)) {
		joueurActif = partie[tour % 2] ;
		jump_line(6);
		console.log("Joueur " + ((tour % 2) + 1) + ", c'est votre tour :");
		console.log("Voici votre tapis : ");
		console.log(joueurActif.tapis);
		jump_line(1);
		console.log("Voici vos lettres : " + joueurActif.lettres);
		jump_line(2);
		tourDePioche(tour, joueurActif);
		jump_line(3);
		console.log("Voici vos lettres après la pioche : " + joueurActif.lettres);
		jump_line(1);
		if (joueurActif.lettres.length >= 3) {
			putWord(joueurActif);
			console.log("Voici votre nouveau tapis : ");
			console.log(joueurActif.tapis);
		}
		tour = tour + 1;
	}
	console.log("Fin de partie au bout de " + Math.round(tour/2) + " tours.");
	console.log("Le joueur " + (((tour-1) % 2) + 1) + " a gagné.");
}

game();

//console.log(listOfLetters);