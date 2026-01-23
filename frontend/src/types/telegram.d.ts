export {};

declare global {
  interface TelegramWebApp {
    initData: string;
    initDataUnsafe: {
      user?: {
        id: number;
        first_name?: string;
        last_name?: string;
        username?: string;
        language_code?: string;
        is_premium?: boolean;
      };
      chat?: unknown;
      start_param?: string;
      auth_date?: number;
      hash?: string;
    };
    ready: () => void;
    expand: () => void;
    close: () => void;
    version: string;
    colorScheme: string;
    themeParams: Record<string, string>;
  }

  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}
