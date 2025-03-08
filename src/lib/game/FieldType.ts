export type FieldType = {
  color: string|null;
  group: number;
};

function emptyField(group = 0): FieldType {
  return {
    color: null,
    group,
  };
}

function coloredField(color: string, group = 0): FieldType {
  return {
    color,
    group,
  };
}

export {emptyField, coloredField}
