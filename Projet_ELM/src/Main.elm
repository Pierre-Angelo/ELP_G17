module Main exposing (..)

import Browser
import Html exposing (..)
import Html.Events exposing (onClick)
import Html.Attributes exposing (..)
import Html.Events exposing (onInput)


-- MAIN


main =
  Browser.sandbox { init = init, update = update, view = view }



-- MODEL


type alias  Model =  { guess : String  , title : String, displayAnswer : Bool }


init : Model
init = { guess = "Type in to guess", title = "Guess it!", displayAnswer = False}
answer : String
answer = "answer"



-- UPDATE


type Msg
  = Guess String
    | Reveal 


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

-- VIEW

view : Model -> Html Msg
view model =
  div [ style "padding-left" "13cm", style "font-family" "sans-serif",style "line-height" "1cm"] 
    [ h1 [ style"font-size" "50px"] [ text model.title]
      ,ul [] [ li [] [ text "meaning" , ul [] [ li [] [ text "noun"] 
                                              , li [] [ text "verb"]]]]
      ,div[][strong [] [text model.guess]]
      ,input [ onInput Guess ][]
      ,div [][input [ type_ "checkbox", onClick Reveal] [], text "show it"] 
    ]
       
        