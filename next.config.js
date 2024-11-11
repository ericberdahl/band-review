const { PHASE_PRODUCTION_BUILD } = require('next/constants');

module.exports = (phase, { defaultConfig }) => {

    const nextConfig = {
        output: (PHASE_PRODUCTION_BUILD == phase ? 'export' : undefined),

        serverRuntimeConfig: {
            isExport: (PHASE_PRODUCTION_BUILD == phase),
            deployedBasePath: '/foothill/bandreview-2024'
        }
    };

    if (nextConfig.serverRuntimeConfig.isExport) {
        nextConfig.basePath = nextConfig.serverRuntimeConfig.deployedBasePath;
    }

    return nextConfig;
}
