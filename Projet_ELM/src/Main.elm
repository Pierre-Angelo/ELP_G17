module Main exposing (..)

import Browser
import Html exposing (..)
import Html.Events exposing (onClick)
import Html.Attributes exposing (..)


-- MAIN


main =
  Browser.sandbox { init = init, update = update, view = view }



-- MODEL


type alias  Model =   String


init : Model
init = "Guess it!"



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
  div [ style "padding-left" "13cm", style "font-family" "sans-serif",style "line-height" "1cm"] 
    [ h1 [ style"font-size" "50px"] [ text model]
      ,ul [] [ li [] [ text "meaning" , ul [] [ li [] [ text "noun"] 
                                              , li [] [ text "verb"]]]]
      ,div[][strong [] [text "Type in to guess"]]
      ,input [][]
      ,div [][input [ type_ "checkbox",onClick Reveal ] [], text "show it"]
    ]
       
        