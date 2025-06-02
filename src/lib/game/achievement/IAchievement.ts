import type {UnknownObject} from "../../../util/UnknownObject";

export interface IAchievement {
  id: string,
  title: string,
  description: string,
  gain: string,
  hint: string,
  req: string,
  eventNames?: string[],
  callback?: (state: UnknownObject, eventName: string, eventData: object) => boolean,
}
