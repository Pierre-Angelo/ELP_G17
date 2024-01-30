const prompt = require('prompt-sync')({sigint: true});
function coucou(){
    console.log("coucou")
}

function create_player(pid){
    player = {
        id : String(pid),
        carpet : [], // contient des words
        letters : [], //contient des caractères
        disp_carpet : function(){
            res = "      9  16 25 36 49 64 81\n"
            for(word of this.carpet){
                for (letter of word){
                    res += letter + "  "
                }
                res += "\n";
            }
            console.log(res)
        },
        disp_letters : function(){
            res = "Voici vos lettres à disposition : "
            for (letter of this.letters){
                res += letter + " ";
            }
            console.log(res);
        },
        entrer_word :  function(){
            return prompt("Entrez votre word : ");
        }
    
    }

    return player
}

module.exports = { create_player };