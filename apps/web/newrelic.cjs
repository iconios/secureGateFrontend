'use strict';

exports.config = {
  app_name: [process.env.NEW_RELIC_APP_NAME || 'SecureGate Web App'],
  license_key: process.env.NEW_RELIC_LICENSE_KEY,

  browser_monitoring: {
    enable: true,
  },

  application_logging: {
    enabled: true,
    forwarding: {
      enabled: true,
    },
    local_decorating: {
      enabled: true,
    },
  },

  distributed_tracing: {
    enabled: true,
  },
};