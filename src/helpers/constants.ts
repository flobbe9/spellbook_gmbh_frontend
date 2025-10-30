import type { Env } from "@/abstracts/Env";
import { LogLevel } from "@/abstracts/LogLevel";

export const ENV: Env = import.meta.env.VITE_ENV as Env;
export const VERSION = import.meta.env.VITE_VERSION as string;
export const LOG_LEVEL = LogLevel[import.meta.env.VITE_LOG_LEVEL as string];

export const CONTENT_TYPE_APPLICATION_JSON = "application/json";
export const CONTENT_TYPE_TEXT_PLAIN = "text/plain";
export const BASE_URL = import.meta.env.VITE_BASE_URL; 
export const BACKEND_API_BASE_URL = `${BASE_URL}/?rest_route=/spellbook_gmbh/v1`;
export const CSRF_HEADER_NAME = "csrf";
export const CSRF_TOKEN_STORAGE_KEY = "csrf";
export const FAILED_TO_FETCH_STATUS_CODE = 503;