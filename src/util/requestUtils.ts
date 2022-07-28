import { Method } from 'axios';

export interface RestClientOptions {
  // Default: false. If true, we'll throw errors if any params are undefined
  strict_param_validation?: boolean;

  // Optionally override API protocol + domain
  // e.g 'https://api.bytick.com'
  baseUrl?: string;

  // Default: true. whether to try and post-process request exceptions.
  parse_exceptions?: boolean;
}

export function serializeParams(
  params: object | undefined,
  method: Method,
  strict_validation = false
): string {
  if (!params) {
    return '';
  }

  if (method !== 'GET') {
    return JSON.stringify(params);
  }

  // Original order should be preserved, no sorting allowed here or sign will fail
  return (
    '?' +
    Object.keys(params)
      .map((key) => {
        const value = params[key];
        if (strict_validation === true && typeof value === 'undefined') {
          throw new Error(
            'Failed to sign API request due to undefined parameter'
          );
        }
        return `${key}=${value}`;
      })
      .join('&')
  );
}
export const programKey = 'tag';
export const programId = '159881cb7207BCDE';

/**
 * - live: production,
 * - aws: aws subdomain,
 * - demo: demo environment
 */
export type OKXEnvironment = 'live' | 'aws' | 'demo';

export function getRestBaseUrl(
  environment: OKXEnvironment,
  restClientOptions: RestClientOptions
) {
  if (restClientOptions.baseUrl) {
    return restClientOptions.baseUrl;
  }

  switch (environment) {
    default:
    case 'demo':
    case 'live': {
      return 'https://www.okx.com';
    }
    case 'aws': {
      return 'https://aws.okex.com';
    }
  }
}

export function isWsPong(response: any) {
  if (response.pong || response.ping) {
    return true;
  }
  return (
    response.request &&
    response.request.op === 'ping' &&
    response.ret_msg === 'pong' &&
    response.success === true
  );
}