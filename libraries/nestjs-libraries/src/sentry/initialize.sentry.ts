import * as Sentry from '@sentry/nestjs';
import { capitalize } from 'lodash';

export const initializeSentry = (appName: string, allowLogs = false) => {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
    return null;
  }

  try {
    // Try to load profiling integration, but make it optional
    let profilingIntegration = null;
    try {
      const { nodeProfilingIntegration } = require('@sentry/profiling-node');
      profilingIntegration = nodeProfilingIntegration();
    } catch (err) {
      // Profiling integration not available, continue without it
      console.log('Sentry profiling integration not available, continuing without it');
    }

    const integrations = [
      Sentry.consoleLoggingIntegration({ levels: ['log', 'info', 'warn', 'error', 'debug', 'assert', 'trace'] }),
      Sentry.openAIIntegration({
        recordInputs: true,
        recordOutputs: true,
      }),
    ];

    if (profilingIntegration) {
      integrations.unshift(profilingIntegration);
    }

    Sentry.init({
      initialScope: {
        tags: {
          service: appName,
          component: 'nestjs',
        },
        contexts: {
          app: {
            name: `Postiz ${capitalize(appName)}`,
          },
        },
      },
      environment: process.env.NODE_ENV || 'development',
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      integrations,
      tracesSampleRate: 1.0,
      enableLogs: true,

      // Profiling (only if integration is available)
      ...(profilingIntegration ? {
        profileSessionSampleRate: process.env.NODE_ENV === 'development' ? 1.0 : 0.45,
        profileLifecycle: 'trace',
      } : {}),
    });
  } catch (err) {
    console.log(err);
  }
  return true;
};
