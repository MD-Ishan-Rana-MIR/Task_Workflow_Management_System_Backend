declare module "http" {
  interface IncomingHttpHeaders {
    'x-user-id'?: string;
    'x-user-role'?: string;
  }
}
