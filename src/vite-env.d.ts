/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_SERVER_BASE_URL?: string;
  readonly VITE_API_URL?: string;
  readonly VITE_OPENAI_API_KEY?: string;
  readonly OPENAI_API_KEY?: string;
  readonly VITE_APP_URL?: string;
  readonly APP_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
