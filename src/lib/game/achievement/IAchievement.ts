export interface IAchievement {
  id: string,
  title: string,
  description: string,
  hint: string,
  req: string,
  callback?: () => boolean,
}
