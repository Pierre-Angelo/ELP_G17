module Main exposing (..)

import Browser
import Html exposing (..)
import Html.Events exposing (onClick)
import Html.Attributes exposing (..)
import Html.Events exposing (onInput)
import Http
import Word
import Platform.Cmd as Cmd
import Task
import Time


-- MAIN


main =
  Browser.element 
  { init = init
  , update = update
  ,subscriptions = subscriptions
  , view = view }



-- MODEL


type alias  Model =  { zone : Time.Zone, time : Time.Posix, guess : String  , title : String, displayAnswer : Bool, answer : String}

initModel : Model
initModel = {zone = Time.utc, time = (Time.millisToPosix 0), guess = "Type in to guess", title = "Guess it!", displayAnswer = False, answer = "rien"}
myurl : String
myurl = "http://localhost:8000/static/words.txt"

init : () -> (Model, Cmd Msg)
init _ = (initModel, Task.perform AdjustTimeZone Time.here)
initAnswer: Cmd Msg
initAnswer = Http.get {url = myurl, expect = Http.expectString GotText}
toto = Task.perform AdjustTimeZone Time.here

-- UPDATE


type Msg
  = Guess String
    | Reveal 
    | GotText (Result Http.Error String)
    | Tick Time.Posix
    | AdjustTimeZone Time.Zone


update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    Guess newGuess ->
      if newGuess == model.answer then
        ({model |guess = "Got it! It is indeed " ++ model.answer}, Cmd.none)
      else
        ({model |guess = "Type in to guess" }, Cmd.none)
    Reveal  ->
      if not model.displayAnswer then
        ({model|title = model.answer
              ,displayAnswer = True}, Cmd.none)
      else 
        ({model|title = "Guess it!" 
              ,displayAnswer = False}, Cmd.none)
    GotText result ->
       case result of
        Ok text ->
          ({model | answer = (Word.randomWord text (Time.toMillis model.zone model.time))}, Cmd.none)
        Err _ ->
          ({model | answer = "une erreur"}, Cmd.none)
    Tick newTime ->
        ({model | time = newTime}, Http.get {url = myurl, expect = Http.expectString GotText})
    AdjustTimeZone newZone ->
        ({model | zone = newZone}, Task.perform Tick Time.now)

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
    ]
       
        