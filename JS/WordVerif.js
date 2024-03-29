

//transform word into list of letters
const str_to_tab = function (x){
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

//create a list of tuples describing the number of occurences of the letters in the list
const possibilities = function(letters) {
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

const word_verification = function (w, letters) {
    let poss = possibilities(letters);
    let res = true;
    for (let i = 0; i < w.length; i++) {
        if (letter_verification(w[i], poss) === false) {
            res = false;
        }
    }
    return res;
}

const verif = function (word, letters) {
    //if the word is to long or to short
    if ((word.length < 3) || (word.length > 9)) {
        return false
    } else {
        return word_verification(str_to_tab(word), letters)
    }
}

module.exports = { verif, str_to_tab };