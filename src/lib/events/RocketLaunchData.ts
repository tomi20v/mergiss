export default interface RocketLaunchData {
  origin: 'launchButton';
  flyingId: string;
  flyOptions: {
    duration: number;
    acceleration: number;
    removeOriginal: boolean;
    scale: number;
  };
}
