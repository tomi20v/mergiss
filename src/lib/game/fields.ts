import { uniqueId } from "lui-g";

export type FieldType = {
  color: string|null;
  group: number;
  id: string;
};

function emptyField(group = 0): FieldType {
  return {
    color: null,
    group,
    id: uniqueId('field-'),
  };
}

function coloredField(color: string, group = 0): FieldType {
  return {
    color,
    group,
    id: uniqueId('field-'),
  };
}

export {emptyField, coloredField}
