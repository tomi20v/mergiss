export interface IAchievement {
  id: string,
  title: string,
  description: string,
  gain: string,
  hint: string,
  req: string,
  callback?: () => boolean,
}
