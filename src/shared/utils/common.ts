import type { IBrowserInfo } from '../../types';

export const getAppInfo = (): IBrowserInfo => {
  // TODO: IMPLEMENT getAppInfo IBrowserInfo
  return {} as IBrowserInfo;
  // return {
  //   javascript_enabled: true, // Assumed since JavaScript is running
  //   time_zone: new Date().getTimezoneOffset(),
  //   language: navigator.language || 'en-US', // Fallback to 'en-US'
  //   color_depth: window.screen ? window.screen.colorDepth : null,
  //   screen_width: window.screen
  //     ? window.screen.width * window.devicePixelRatio || window.screen.width
  //     : null,
  //   screen_height: window.screen
  //     ? window.screen.height * window.devicePixelRatio || window.screen.height
  //     : null,
  //   user_agent: navigator.userAgent,
  // };
};

export const executeCallback = async ({
  callbacks,
  callback,
  data = null,
  throwError = false,
}: {
  callbacks?: any;
  callback: string;
  data?: any;
  throwError?: boolean;
}) => {
  try {
    if (callbacks && callback in callbacks) {
      if (data) {
        await callbacks[callback](data);
      } else {
        await callbacks[callback]();
      }
    }
  } catch (e) {
    console.error(e);
    if (throwError) {
      throw e;
    }
  }
};
