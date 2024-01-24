module Main exposing (..)

import Browser
import Html exposing (..)
import Html.Events exposing (onClick)
import Html.Attributes exposing (..)
import Html.Events exposing (onInput)
import Http
import Json.Decode exposing (Decoder, map2, field, int, string)
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


type alias  Model =  { zone : Time.Zone, time : Time.Posix, guess : String  , title : String, displayAnswer : Bool, answer : String, json : JsonContent}

initModel : Model
initModel = {zone = Time.utc, time = (Time.millisToPosix 0), guess = "Type in to guess", title = "Guess it!", displayAnswer = False, answer = "null", json = Loading}
myurl : String
myurl = "http://localhost:8000/static/words.txt"

init : () -> (Model, Cmd Msg)
init _ = (initModel, Task.perform AdjustTimeZone Time.here)


type alias Name =				--Création de trois types afin de décoder le Json
  { word : String
    ,meanings : List Lick
  }

type alias Lick =
  { partOfSpeech : String
    ,definitions : List Definition
  }

type alias Definition =
  { definition : String
  }

-- UPDATE


type Msg
  = Guess String
    | Reveal 
    | GotText (Result Http.Error String)
    | Tick Time.Posix
    | AdjustTimeZone Time.Zone
    | GotJson (Result Http.Error (List Name))

type JsonContent
  = Failure
  | Loading
  | Success (List Name)


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
          ({model | answer = (Word.randomWord text (Time.toMillis model.zone model.time))}, getJson (Word.randomWord text (Time.toMillis model.zone model.time)))
        Err _ ->
          ({model | answer = "une erreur"}, Cmd.none)
    Tick newTime ->
        ({model | time = newTime}, Http.get {url = myurl, expect = Http.expectString GotText})
    AdjustTimeZone newZone ->
        ({model | zone = newZone}, Task.perform Tick Time.now)
    GotJson result ->
        case result of
            Ok name ->
                ({model | json = Success name}, Cmd.none)
            Err _ ->
                ({model | json = Failure}, Cmd.none)

-- SUBSCRIPTIONS

subscriptions : Model -> Sub Msg
subscriptions model =
  Sub.none
     

-- VIEW

view : Model -> Html Msg
view model =
  div [ style "padding-left" "15%", style "font-family" "sans-serif",style "line-height" "1cm", style "font-size" "85%"]
    [ h1 [ style"font-size" "50px"] [ text model.title]
      ,(define model)
      ,div[style"font-size" "120%"][strong [] [text model.guess]]
      ,input [ onInput Guess ][]
      ,div [style"font-size" "120%"][input [ type_ "checkbox", onClick Reveal] [], text "show it"]
    ]

define : Model -> Html Msg
define model =
  case model.json of
    Failure ->
      ul[] [li [] [text "I was unable to load the definition."]]

    Loading ->
      ul [] [li [] [text "Loading..."]]

    Success fullText ->
      --pre [] [ text fullText ]
      ul [] [li [] (describe fullText)]

-- HTTP


getJson : String -> Cmd Msg
getJson word =
  Http.get
    { url = ("https://api.dictionaryapi.dev/api/v2/entries/en/" ++ word)
    , expect = Http.expectJson GotJson nameDecoder
    }


nameDecoder : Decoder (List Name)		--Trois fonctions qui permettent de décoder le Json
nameDecoder =
  Json.Decode.oneOf
  [
  Json.Decode.map2 Name
    (field "word" string)
    (field "meanings" decodeLick)
    |> Json.Decode.list
  ]

decodeLick : Decoder (List Lick)
decodeLick =
  Json.Decode.map2 Lick
    (field "partOfSpeech" string)
    (field "definitions" decodeDefinition)
    |>Json.Decode.list

decodeDefinition : Decoder (List Definition)
decodeDefinition =
  Json.Decode.map Definition
    (field "definition" string)
    |>Json.Decode.list

def: List Definition -> List (Html msg)			--Trois fonctions qui permettent d'extraire les définitions du fichier json décodé
def lst = case lst of
    [] -> []
    (x :: xs) -> li [] [text x.definition] :: def xs

mean: List Lick -> List (Html msg)
mean lst = case lst of
    [] -> []
    (x :: xs) -> li [] [text x.partOfSpeech, ol [] (def x.definitions)] :: mean xs

describe: List Name -> List (Html msg)
describe lst = case lst of
    [] -> []
    (x :: xs) -> li [] [text "meaning", ul [] (mean x.meanings)] :: describe xs