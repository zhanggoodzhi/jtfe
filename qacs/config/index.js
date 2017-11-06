const env = process.env.NODE_ENV;
const target = process.env.TARGET;

const config = {
    devport: 9977,
    client: 'client',
    server: 'server',
    views: 'src/main/webapp/views',
    modifyVars: {
        '@layout-body-background': '#f8f8f8',
        '@item-active-bg': '#f0f0f0',
        '@avatar-size-lg': '50px',
        '@avatar-size-base': '40px'
    }
};

module.exports = config;
