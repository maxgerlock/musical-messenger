import { AutoFilter, Reverb, Distortion, FeedbackDelay } from 'tone';

export const slowAutoFilter = new AutoFilter("4n").toDestination().start();
export const fastAutoFilter = new AutoFilter("8n").toDestination().start();
export const reverb = new Reverb(10, 0.5).toDestination();
export const distortion = new Distortion(0.5).toDestination();
export const feedbackDelay = new FeedbackDelay("16n", "0.4").toDestination();
feedbackDelay.set({wet: 0.6});
reverb.set({wet: 0.9});
