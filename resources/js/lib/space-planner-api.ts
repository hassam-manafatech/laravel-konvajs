function readXsrfToken(): string {
    const match = document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]*)/);

    return match ? decodeURIComponent(match[1]) : '';
}

async function request<TResponse>(
    method: 'POST' | 'PATCH' | 'DELETE',
    url: string,
    body?: unknown,
): Promise<TResponse> {
    const response = await fetch(url, {
        method,
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-XSRF-TOKEN': readXsrfToken(),
        },
        body: body === undefined ? undefined : JSON.stringify(body),
    });

    if (!response.ok) {
        const payload = await response.json().catch(() => null);

        throw new SpacePlannerApiError(response.status, payload);
    }

    return (await response.json()) as TResponse;
}

export class SpacePlannerApiError extends Error {
    constructor(
        public readonly status: number,
        public readonly payload: { message?: string; errors?: Record<string, string[]> } | null,
    ) {
        super(payload?.message ?? `Request failed with status ${status}`);
    }
}

export function postJson<TResponse>(url: string, body?: unknown): Promise<TResponse> {
    return request<TResponse>('POST', url, body);
}

export function patchJson<TResponse>(url: string, body?: unknown): Promise<TResponse> {
    return request<TResponse>('PATCH', url, body);
}

export function deleteJson<TResponse>(url: string): Promise<TResponse> {
    return request<TResponse>('DELETE', url);
}
