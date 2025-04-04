import { uniqueId } from "lui-g";

class FieldType {

  // we need these to be reactive. If only the field object is made reactive, then
  //  there's a difference between what MBuildBoard (originator) and sub-components
  //  eg. MBoadFields see. Making the props reactive and not having immutable fields helps
  color: string | null = $state(null);
  group: number = $state(0);
  id: string;

  constructor(group: number, color: string | null = null, id: string) {
    this.group = group;
    this.color = color;
    this.id = id;
  }

}

function emptyField(group = 0): FieldType {
  return new FieldType(group, null, uniqueId('field-'));
}

export { FieldType, emptyField};
