module Word exposing (..)

import String
import Basics
import Random
import Http
import Html
import Time
import Task

f = "../static/words.txt"

type Msg
    = GotText (Result Http.Error String)

getText: Cmd msg -> String
getText msg =
  case msg of
    GotText result ->
      case result of
        Ok fullText ->
          fullText

        Err _ ->
          ""

getString: String -> String
getString file =
    getText (Http.get {url = file, expect = Http.expectString GotText})

stringToTab: String -> List String
stringToTab string =
    String.split " " string

random min max =
    Random.step (Random.int min max) (Random.initialSeed 1)

getElem tab i = case tab of
    [] -> ""
    (w::ws) -> if i == 0 then
                    w
               else if i < 0 then
                    ""
               else
                    getElem ws (i-1)
