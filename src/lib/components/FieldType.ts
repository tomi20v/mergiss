export type FieldType = {
  color: string|null;
  group: number;
};

function emptyField(): FieldType {
  return {
    color: null,
    group: 0,
  };
}

function coloredField(color: string): FieldType {
  return {
    color,
    group: 0,
  };
}

export {emptyField, coloredField}
