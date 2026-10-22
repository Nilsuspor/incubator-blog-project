export class DomainException extends Error {
  constructor(
    detail: string,
    public readonly code: string,
    public readonly source?: string,
  ) {
    super(detail);
  }
}