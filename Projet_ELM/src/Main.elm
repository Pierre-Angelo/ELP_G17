module Main exposing (..)

import Browser
import Html exposing (..)
import Html.Events exposing (onClick)
import Html.Attributes exposing (..)
import Html.Events exposing (onInput)
import Http
import Word
import Platform.Cmd as Cmd


-- MAIN


main =
  Browser.element 
  { init = init
  , update = update
  ,subscriptions = subscriptions
  , view = view }



-- MODEL


type alias  Model =  { guess : String  , title : String, displayAnswer : Bool,lesMots : String}

initModel : Model
initModel = { guess = "Type in to guess", title = "Guess it!", displayAnswer = False ,lesMots = "rien"}
myurl : String
myurl = "http://localhost:8000/static/words.txt"

init : () -> (Model, Cmd Msg)
init _ = (initModel, Http.get {url = myurl, expect = Http.expectString GotText})
answer : String
answer = "answer"

-- UPDATE


type Msg
  = Guess String
    | Reveal 
    |GotText (Result Http.Error String)


update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    Guess newGuess ->
      if newGuess == answer then 
        ({model |guess = "Got it! It is indeed " ++ answer},Cmd.none)
      else
        ({model |guess = "Type in to guess" },Cmd.none)
    Reveal  ->
      if not model.displayAnswer then
        ({model|title = answer 
              ,displayAnswer = True},Cmd.none)
      else 
        ({model|title = "Guess it!" 
              ,displayAnswer = False},Cmd.none)
    GotText result ->
       case result of
        Ok text ->
          ({model | lesMots = text},Cmd.none)
        Err _ ->
          ({model | lesMots = "une erreur"},Cmd.none)

-- SUBSCRIPTIONS

subscriptions : Model -> Sub Msg
subscriptions model =
  Sub.none
     

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
       
        