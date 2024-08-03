// fetcho.test.ts

import { TypedResponse } from './../src/types';
import { fetcho } from './../src/fetcho';

global.fetch = jest.fn(); // Mock the fetch global

describe('fetcho', () => {
  const apiUrl = 'https://jsonplaceholder.typicode.com/todos/1';

  beforeEach(() => {
    // Reset the fetch mock before each test
    (fetch as jest.Mock).mockClear();
  });

  it('should perform a GET request and return a typed response', async () => {
    const mockResponse: TypedResponse<{ title: string }> = {
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => ({ title: 'Test Todo' }),
    } as TypedResponse<{ title: string }>;

    (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    const response = await fetcho<{ title: string }>(apiUrl);

    expect(fetch).toHaveBeenCalledWith(apiUrl, undefined);
    expect(response).toEqual(mockResponse);
    const jsonData = await response.json();
    expect(jsonData.title).toBe('Test Todo');
  });

  it('should perform a POST request with a valid body', async () => {
    const mockResponse: TypedResponse<{ success: boolean }> = {
      ok: true,
      status: 201,
      statusText: 'Created',
      json: async () => ({ success: true }),
    } as TypedResponse<{ success: boolean }>;

    (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    const requestBody = JSON.stringify({
      userId: '1',
      title: 'New Todo',
      completed: false,
    });

    const response = await fetcho<{ success: boolean }>(apiUrl, {
      method: 'POST',
      body: requestBody,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    expect(fetch).toHaveBeenCalledWith(apiUrl, {
      method: 'POST',
      body: requestBody,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    expect(response).toEqual(mockResponse);
    const jsonData = await response.json();
    expect(jsonData.success).toBe(true);
  });

  it('should throw an error when body is provided with a non-body method', async () => {
    const requestBody = JSON.stringify({
      userId: '1',
      title: 'New Todo',
      completed: false,
    });

    await expect(
      fetcho(apiUrl, {
        method: 'GET',
        // @ts-expect-error
        body: requestBody,
      }),
    ).rejects.toThrowError('HTTP method GET does not allow a body');
  });

  it('should handle a network error gracefully', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));

    await expect(fetcho(apiUrl)).rejects.toThrowError('Network Error');
  });

  it('should set default headers when none are provided', async () => {
    const mockResponse: TypedResponse<{ title: string }> = {
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => ({ title: 'Default Header Todo' }),
    } as TypedResponse<{ title: string }>;

    (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    const response = await fetcho<{ title: string }>(apiUrl);

    expect(fetch).toHaveBeenCalledWith(apiUrl, undefined);
    const jsonData = await response.json();
    expect(jsonData.title).toBe('Default Header Todo');
  });
});
