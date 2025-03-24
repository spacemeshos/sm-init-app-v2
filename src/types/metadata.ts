type Base64String = string;
type HexString = string;

export type PosMetadata = {
  NodeId: Base64String
  CommitmentAtxId: Base64String;
  LabelsPerUnit: number;
  NumUnits: number;
  MaxFileSize: number;
  Nonce: number;
  NonceValue: HexString;
};
