import { AutoFilter, Reverb, Distortion, FeedbackDelay } from 'tone';

export const slowAutoFilter = new AutoFilter("4n").toDestination().start();
export const fastAutoFilter = new AutoFilter("8n").toDestination().start();
export const reverb = new Reverb(1.5, 0.5, .5).toDestination();
export const distortion = new Distortion(0.5).toDestination();
export const feedbackDelay = new FeedbackDelay("8n", "0.4").toDestination();
feedbackDelay.set({wet: 0.3});
