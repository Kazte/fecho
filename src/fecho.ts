import { TypedRequestInit, TypedResponse } from './types';

/**
 * A typesafe fetch function.
 *
 * @param input - The input URL or RequestInfo.
 * @param init - The initialization options for the request.
 * @returns A Promise that resolves to the typed response.
 */
export async function fecho<ResponseType = any>(
  input: RequestInfo | URL | string,
  init?: TypedRequestInit,
): Promise<TypedResponse<ResponseType>> {
  if (
    init?.method &&
    !['POST', 'PUT', 'DELETE', 'UPDATE'].includes(init.method)
  ) {
    if (init.body) {
      throw new Error(`HTTP method ${init.method} does not allow a body`);
    }
  }
  const response = await fetch(input, init);

  return response;
}
