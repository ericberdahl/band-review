const { PHASE_PRODUCTION_BUILD } = require('next/constants');

module.exports = (phase, { defaultConfig }) => {

    const nextConfig = {
        output: (PHASE_PRODUCTION_BUILD == phase ? 'export' : undefined),

        env: {
            IS_EXPORT: (PHASE_PRODUCTION_BUILD == phase ? 'true' : 'false'),
            DEPLOYED_BASE_PATH: '/foothill/bandreview-2024',
            /* prefix NEXT_PUBLIC_ to variables moving from publicRuntimeConfig */
        },
    };

    if (nextConfig.env.IS_EXPORT.toLowerCase() === "true") {
        nextConfig.basePath = nextConfig.env.DEPLOYED_BASE_PATH;
    }

    return nextConfig;
}
