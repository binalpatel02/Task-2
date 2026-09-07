export interface AppError extends Error {
    statusCode?: number;
    code?: string;
    details?: unknown;
}