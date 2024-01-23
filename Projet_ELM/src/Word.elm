module Word exposing (..)

import Random
import String

stringToTab: String -> List String
stringToTab string =
    String.split " " string

random: Int -> Int -> Int -> Int
random min max seed =
    let (a,b) = Random.step (Random.int min max) (Random.initialSeed seed) in a

getElem: List String -> Int -> String
getElem tab i = case tab of
    [] -> ""
    (w::ws) -> if i == 0 then
                    w
               else if i < 0 then
                    ""
               else
                    getElem ws (i-1)

randomWord: String -> Int -> String
randomWord txt seed =
    getElem (stringToTab txt) (random 0 999 seed)