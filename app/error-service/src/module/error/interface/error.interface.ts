export interface ICreateError {
    method: string;
    url: string;
    header?: Record<string, unknown>;
    extra?: Record<string, unknown>;
    data?: Record<string, unknown>;
}

export interface IErrorResponse {
    method: string;
    url: string;
    header: Record<string, unknown>;
    extra: Record<string, unknown>;
    data: Record<string, unknown>;
    created_at: Date;
}