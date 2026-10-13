export interface ApiResponse<T> {
    data: T;
}

type TypeGuard<T> = (value: unknown) => value is T;

function isApiResponse<T>(
    value: unknown,
    guard: TypeGuard<T>,
): value is ApiResponse<T> {
    return (
        typeof value === 'object' &&
        value !== null &&
        'data' in value &&
        guard(value.data)
    );
}

export async function getApiData<T>(
    url: string,
    guard: TypeGuard<T>,
    signal?: AbortSignal,
): Promise<T> {
    const response = await fetch(url, { signal });

    if (!response.ok) {
        throw new Error(`Không tải được dữ liệu. HTTP ${response.status}`);
    }

    const body: unknown = await response.json();

    if (!isApiResponse(body, guard)) {
        throw new Error('Dữ liệu API không đúng cấu trúc.');
    }

    return body.data;
}