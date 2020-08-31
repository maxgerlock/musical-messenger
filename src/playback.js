import { Player } from 'tone';
import bass from './audio/MM_bass.mp3'
import kick from './audio/MM_kick.mp3'
import chimes from './audio/MM_chimes.mp3'
import choral_lead from './audio/MM_choral lead.mp3'
import dist_lead from './audio/MM_dist lead.mp3'
import harsh_pad from './audio/MM_harsh pad.mp3'
import hi_hat from './audio/MM_hi-hat.mp3'
import nice_pad from './audio/MM_nice pad.mp3'
import snare from './audio/MM_snare.mp3'
import twitchy_perc from './audio/MM_twitchy perc.mp3'

const MUTE_NEUTRAL_PROBABILITY = 0.33;
const UNMUTE_NEUTRAL_PROBABILITY = 0.33;
const UNIVERSAL_GAIN_MODIFIER = 0.7;


const kickPlayer = new Player({
	url : kick,
  loop: true,
	autostart : false,
  fadeIn: 0.3,
  fadeOut: 0.3,
  volume : -2.75 * UNIVERSAL_GAIN_MODIFIER,
}).toDestination();

const bassPlayer = new Player({
	url : bass,
  loop: true,
	autostart : false,
  fadeIn: 0.3,
  fadeOut: 0.3,
  volume : -13.0 * UNIVERSAL_GAIN_MODIFIER,
}).toDestination();

const chimesPlayer = new Player({
	url : chimes,
  loop: true,
	autostart : false,
  fadeIn: 0.3,
  fadeOut: 0.3,
  volume : -9.97 * UNIVERSAL_GAIN_MODIFIER,
}).toDestination();

const choralLeadPlayer = new Player({
	url : choral_lead,
  loop: true,
	autostart : false,
  fadeIn: 0.3,
  fadeOut: 0.3,
  volume : -4.12 * UNIVERSAL_GAIN_MODIFIER,
}).toDestination();

const distLeadPlayer = new Player({
	url : dist_lead,
  loop: true,
	autostart : false,
  fadeIn: 0.3,
  fadeOut: 0.3,
  volume : -8.7 * UNIVERSAL_GAIN_MODIFIER,
}).toDestination();

const harshPadPlayer = new Player({
	url : harsh_pad,
  loop: true,
  autostart : false,
  fadeIn: 0.3,
  fadeOut: 0.3,
  volume : -8.7 * UNIVERSAL_GAIN_MODIFIER,
}).toDestination();

const hihatPlayer = new Player({
	url : hi_hat,
  loop: true,
	autostart : false,
  fadeIn: 0.3,
  fadeOut: 0.3,
  volume : -10.0 * UNIVERSAL_GAIN_MODIFIER,
}).toDestination();

const nicePadPlayer = new Player({
	url : nice_pad,
  loop: true,
	autostart : false,
  fadeIn: 0.3,
  fadeOut: 0.3,
  volume : -9.0 * UNIVERSAL_GAIN_MODIFIER,
}).toDestination();

const snarePlayer = new Player({
	url : snare,
  loop: true,
	autostart : false,
  fadeIn: 0.3,
  fadeOut: 0.3,
  volume : -10.0 * UNIVERSAL_GAIN_MODIFIER,
}).toDestination();

const twitchyPercPlayer = new Player({
	url : twitchy_perc,
  loop: true,
	autostart : false,
  fadeIn: 0.3,
  fadeOut: 0.3,
  volume : -13.2 * UNIVERSAL_GAIN_MODIFIER,
}).toDestination();

const sources = [
  {
    name: 'distLead',
    player: distLeadPlayer,
    minimumSentiment: 0,
    maximumSentiment: 0.25,
  },
  {
    name: 'harshPad',
    player: harshPadPlayer,
    minimumSentiment: 0,
    maximumSentiment: 0.25,
  },
  {
    name: 'twitchyPerc',
    player: twitchyPercPlayer,
    minimumSentiment: 0.25,
    maximumSentiment: 0.5,
  },
  {
    name: 'hihat',
    player: hihatPlayer,
    neutral: true,
    minimumSentiment: 0.4,
    maximumSentiment: 0.6,
  },
  {
    name: 'snare',
    player: snarePlayer,
    neutral: true,
    minimumSentiment: 0.4,
    maximumSentiment: 0.6,
  },
  {
    name: 'kick',
    player: kickPlayer,
    neutral: true,
    minimumSentiment: 0.4,
    maximumSentiment: 0.6,
  },
  {
    name: 'bass',
    player: bassPlayer,
    neutral: true,
    minimumSentiment: 0.4,
    maximumSentiment: 0.6,
  },
  {
    name: 'nicePad',
    player: nicePadPlayer,
    minimumSentiment: 0.5,
    maximumSentiment: 0.75,
  },
  {
    name: 'choralLead',
    player: choralLeadPlayer,
    minimumSentiment: 0.75,
    maximumSentiment: 1.00,
  },
  {
    name: 'chimes',
    player: chimesPlayer,
    minimumSentiment: 0.75,
    maximumSentiment: 1.00,
  },
]

export function setupPlayback() {
  sources.forEach(source => source.player.mute = true);
  sources.forEach(source => source.player.sync().start(0));
}

function compareSourcesAsc(s1, s2) {
  if (s1.minimumSentiment < s2.minimumSentiment) {
    return -1;
  } else if (s1.minimumSentiment === s2.minimumSentiment) {
    return 0;
  } else {
    return 1;
  }
}

function compareSourcesDesc(s1, s2) {
  return -1*compareSourcesAsc(s1, s2);
}

function sentimentIsExtreme(sentiment) {
  return (Math.abs(sentiment - 0.5) > 0.25);
}

function sentimentIsExtremeChange(sentiment, lastSentiment) {
  return (Math.abs(sentiment - lastSentiment) > 0.5);
}

function findUnmuteCandidates(sentiment) {
  let unmuteCandidates = [];
  if (sentiment >= 0.5) { // if sentiment is positive, play the most positive valid source
    unmuteCandidates = sources.filter(source => source.minimumSentiment >= 0.5 && source.minimumSentiment < sentiment && source.player.mute === true)
    unmuteCandidates.sort(compareSourcesDesc);
  } else { // if sentiment is negative, play the most negative valid source
    unmuteCandidates = sources.filter(source => source.maximumSentiment < 0.5 && source.maximumSentiment > sentiment && source.player.mute === true)
    unmuteCandidates.sort(compareSourcesAsc);
  }
  return unmuteCandidates;
}

function findMuteCandidates(sentiment) {
  let muteCandidates = [];
  if (sentiment >= 0.5) { // if sentiment is positive, mute the most negative source
    muteCandidates = sources.filter(source => source.maximumSentiment < 0.5 && source.player.mute === false)
    muteCandidates.sort(compareSourcesAsc);
  } else { // if sentiment is negative, mute the most positive source
    muteCandidates = sources.filter(source => source.minimumSentiment > 0.5 && source.player.mute === false)
    muteCandidates.sort(compareSourcesDesc);
  }
  return muteCandidates;
}

function randomlyActivateNeutralSources() {
  if (Math.random() < UNMUTE_NEUTRAL_PROBABILITY) {
    let neutralSources = sources.filter(source => source.player.mute === true && source.neutral === true);
    if (neutralSources.length > 0) {
      let randomSource = neutralSources[Math.floor(Math.random() * neutralSources.length)];
      randomSource.player.mute = false;
    }
  }
}

function randomlyMuteNeutralSources() {
  if (Math.random() < MUTE_NEUTRAL_PROBABILITY) {
    let neutralSources = sources.filter(source => source.player.mute === false && source.neutral === true);
    if (neutralSources.length > 0) {
      let randomSource = neutralSources[Math.floor(Math.random() * neutralSources.length)];
      randomSource.player.mute = true;
    }
  }
}

let lastSentiment = 0.5;

export function activateTracksBySentiment(sentiment) {
  const kick = sources.find(source => source.name === 'kick'); // always play the kick to get things started
  kick.player.mute = false;

  const unmuteCandidates = findUnmuteCandidates(sentiment);
  let muteCandidates = [];
  if (sentimentIsExtreme(sentiment)) {
    muteCandidates = findMuteCandidates(sentiment);
  }
  if (sentimentIsExtremeChange(sentiment, lastSentiment)) {
    randomlyMuteNeutralSources();
  }

  if (unmuteCandidates.length > 0) {
    unmuteCandidates[0].player.mute = false;
  }
  if (muteCandidates.length > 0) {
    muteCandidates[0].player.mute = true;
  }

  randomlyActivateNeutralSources();
  lastSentiment = sentiment;
}
