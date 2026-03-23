export interface ApiValidationError {
  errors: Record<string, string[]>;
}

export interface ApiServerError {
  status: number;
  message: string;
  detail: string;
}
