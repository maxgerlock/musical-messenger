## Musical Messenger

An application for audiolizing conversations based on the sentiment of each message. This is currently a proof of concept which simulates on online conversation between two people.

### Dynamically trigger tracks based on the sentiment of each message
This app utilizes Tone.js to trigger an underlying set of tracks which are categorized from "negative-sounding" to "positive-sounding". When a message is sent that meets the sentiment criteria for a set of tracks, an appropriate track is triggered to start playing. If the sentiment is extreme, it may also mute a track with opposite sentiment.

### Synthesize send/recieve message tones
This app makes use of Tone.js's `synth` library to dynamically generate send/receive chords with a level of dissonance proportional to the sentiment of the message.

### Rating sentiment
Sentiment is currently scored using a Tensorflow CNN trained on IMDB movie reviews. Future iterations will make use of a more advanced model that better understands the context of each word rather than taking each word somewhat in isolation.
