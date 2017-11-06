const config = {
    proxy: 'http://127.0.0.1:9090',
    // proxy: 'http://192.168.199.201:9090',
    port: 9000,
    modifyVars: {
        '@layout-body-background ': '#f8f6f2',
        '@layout-header-background': '#fff',
        '@layout-header-height': '48px',
        '@layout-header-padding': '0',
        '@primary-color': '#1f9ee8',
        '@info-color': '#1f9ee8',
    }
};

module.exports = config;
