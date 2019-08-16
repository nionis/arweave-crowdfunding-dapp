enum Types {
  NUMBER,
  ETHER,
  CHECK,
  PLUS
}

export interface IStep {
  type: keyof typeof Types;
  selected: boolean;
  number?: number;
  onClick?: () => any;
}
