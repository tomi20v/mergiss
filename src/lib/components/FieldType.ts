export type FieldType = string|null;

function emptyField(): FieldType {
  return null;
}

function coloredField(color: string): FieldType {
  return color;
}

export {emptyField, coloredField}
