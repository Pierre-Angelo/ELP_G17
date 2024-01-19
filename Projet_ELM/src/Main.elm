module Main exposing (..)

import Browser
import Html exposing (Html, button, div, text,strong)
import Html.Events exposing (onClick)



-- MAIN


main =
  Browser.sandbox { init = init, update = update, view = view }



-- MODEL


type alias  Model =   String


init : Model
init = " Guess it!"



-- UPDATE


type Msg
  = Guess 
  | Reveal 


update : Msg -> Model -> Model
update msg model =
  case msg of
    Guess ->
      "Got it! It is indeed"

    Reveal ->
      "answer"



-- VIEW


view : Model -> Html Msg
view model =
  div []
    [ strong  [Html.String.Attribute.attribute "Guess it"]
    
    ]