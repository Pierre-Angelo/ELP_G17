module Sucess exposing (..)
-- Make a GET request to load a book called "Public Opinion"
--
-- Read how it works:
--   https://guide.elm-lang.org/effects/http.html
--

import Browser
import Html exposing (..)
import Html.Attributes exposing (style)
import Html.Events exposing (..)
import Http
import Json.Decode exposing (Decoder, map2, field, int, string)
import Dict exposing (Dict)

-- MAIN


main =
  Browser.element
    { init = init
    , update = update
    , subscriptions = subscriptions
    , view = view
    }



-- MODEL


type Model
  = Failure
  | Loading
  | Success (List Name)



type alias Name =
  { word : String
    , meanings : List Lick
  }
  
type alias Lick =
  {partOfSpeech : String
  , definitions : List Defini}
  
type alias Defini =
  {definition : String}


init : () -> (Model, Cmd Msg)
init _ =
  ( Loading, getName)



-- UPDATE


type Msg
  = GotName (Result Http.Error (List Name))


update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    GotName result ->
      case result of
        Ok name ->
          (Success name, Cmd.none)

        Err _ ->
          (Failure, Cmd.none)



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
  Sub.none



-- VIEW


view : Model -> Html Msg
view model =
  case model of
    Failure ->
      text "I was unable to load your book."

    Loading ->
      text "Loading..."

    Success fullText ->
      --pre [] [ text fullText ]
      div []
        [ h2 [] [ text "Random Quotes" ]
        , viewName model
        ]
    
        
        
viewName : Model -> Html Msg
viewName model =
  case model of
    Failure ->
      div []
        [text "I could not load a random quote for some reason. "]
        

    Loading ->
      text "Loading..."

    Success name ->
      div []
         [ text (mot name)    --(Debug.toString (name)) ] --((List.head (name)).word))]
         , div [] (partSpeech name)
         , div [] (definition1 name)
         , div [] (definition2 name)]
        



-- HTTP


getName : Cmd Msg
getName =
  Http.get
    { url = "https://api.dictionaryapi.dev/api/v2/entries/en/branch"
    , expect = Http.expectJson GotName nameDecoder
    }


nameDecoder : Decoder (List Name)
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
    (field "definitions" decodeDefini)
    |>Json.Decode.list

decodeDefini : Decoder (List Defini)
decodeDefini =
  Json.Decode.map Defini
    (field "definition" string)
    |>Json.Decode.list


--listnameDecoder : Decoder (List Name)
--listnameDecoder =
  --Json.Decode.list nameDecoder

mot : List Name -> String
mot lst = case lst of
  [] -> "No"
  (x :: xs) -> case x of
                b -> b.word






partSpeech : List Name -> List (Html Msg)
partSpeech lst = case lst of
  [] -> [text "No partSpeech"]
  (x :: xs) -> case x.meanings of
                b -> deftwo b
                
deftwo : List Lick -> List (Html Msg)
deftwo lst = case lst of
  [] -> [text "Fin deftwo"]
  (x :: xs) -> div[] [text x.partOfSpeech] :: (deftwo xs)
                --case x of
                --b -> b.partOfSpeech






definition : List Name -> List (Html Msg)
definition lst = case lst of
  [] -> [text "No definition"]
  (x :: xs) -> case x.meanings of
                b -> defs b
defs : List Lick -> List (Html Msg)
defs lst = case lst of
  [] -> [text "No defs"]
  (x :: xs) -> case x.definitions of
                b -> last b
                
last : List Defini -> List (Html Msg)
last lst = case lst of
  [] -> [text ""]
  (x :: xs) -> div [] [text x.definition]  :: (last xs)


-- Donne première liste de defs et dernière liste de defs


definition1 : List Name -> List (Html Msg)
definition1 lst = case lst of
  [] -> [text "No definition"]
  (x :: xs) -> case x.meanings of
                b -> defs b


definition2 : List Name -> List (Html Msg)
definition2 lst = case lst of
  [] -> [text "No definition"]
  (x :: xs) -> case x.meanings of
                [] -> [text "No definition2"]
                (b :: bs) -> defs bs
                
defs2 : List Lick -> List (Html Msg)
defs2 lst = case lst of
  [] -> [text "No defs"]
  (x :: xs) -> case x.definitions of
               [] -> [text "No defs2"]
               (y :: ys) -> div[] [text y.definition]  :: (defs2 xs)

def : List Name -> Html msg
def names =
