declare module '@/config' {
  interface Config {
    appName: string;
    appDescription: string;
    domainName: string;
    crisp?: {
      id: string;
      onlyShowOnRoutes: string[];
    };
    stripe?: {
      plans: any[];
    };
    aws?: {
      bucket: string;
      bucketUrl: string;
      cdn: string;
    };
    resend: {
      fromNoReply: string;
      fromAdmin: string;
      supportEmail: string;
    };
    auth: {
      loginUrl: string;
      callbackUrl: string;
    };
  }
  const config: Config;
  export default config;
}
