import { AutoFilter, Reverb, Distortion } from 'tone';

export const slowAutoFilter = new AutoFilter("4n").toDestination().start();
export const fastAutoFilter = new AutoFilter("8n").toDestination().start();
export const reverb = new Reverb(1.5, 0.5, .3).toDestination();
export const distortion = new Distortion(0.5);
