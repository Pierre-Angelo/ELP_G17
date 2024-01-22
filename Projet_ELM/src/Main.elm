module Main exposing (..)

import Browser
import Html exposing (..)
import Html.Events exposing (onClick)
import Html.Attributes exposing (..)
import Html.Events exposing (onInput)
import Http
import Word


-- MAIN


main =
  Browser.sandbox { init = init, update = update, view = view }



-- MODEL


type alias  Model =  { guess : String  , title : String, displayAnswer : Bool,lesMots : String,tmp : Cmd Msg}
myurl : String
myurl = "https://perso.liris.cnrs.fr/tristan.roussillon/GuessIt/thousand_words_things_explainer.txt"

init : Model
init = { guess = "Type in to guess", title = "Guess it!", displayAnswer = False ,lesMots = "rien", tmp = Http.get {url = myurl, expect = Http.expectString GotText}}
answer : String
answer = "answer"

-- UPDATE


type Msg
  = Guess String
    | Reveal 
    |GotText (Result Http.Error String)


update : Msg -> Model -> Model
update msg model =
  case msg of
    Guess newGuess ->
      if newGuess == answer then 
        {model |guess = "Got it! It is indeed " ++ answer} 
      else
        {model |guess = "Type in to guess" }
    Reveal  ->
      if not model.displayAnswer then
        {model|title = answer 
              ,displayAnswer = True}
      else 
        {model|title = "Guess it!" 
              ,displayAnswer = False}
    GotText result ->
       case result of
        Ok text ->
          {model | lesMots = text}
        Err _ ->
          {model | lesMots = "une erreur"}

-- VIEW

view : Model -> Html Msg
view model =
  div [ style "padding-left" "13cm", style "font-family" "sans-serif",style "line-height" "1cm"] 
    [ h1 [ style"font-size" "50px"] [ text model.title]
      ,ul [] [ li [] [ text "meaning" , ul [] [ li [] [ text "noun",ol [][li [][text "Def1"]
                                                                          ,li [][text "Def2"]]] 
                                              , li [] [ text "verb"]]]]
      ,div[][strong [] [text model.guess]]
      ,input [ onInput Guess ][]
      ,div [][input [ type_ "checkbox", onClick Reveal] [], text "show it"] 
      ,div [][text model.lesMots]
    ]
       
        