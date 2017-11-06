const config = {};

if (process.env.NODE_ENV === 'production') {
    Object.assign(config, {
        authorities: '[[${authentication.authorities}]].map(function(v){return v.authority;})'
    });
} else {
    Object.assign(config, {
        authorities: '["ROLE_ADMIN_ICB"]', // ROLE_ANONYMOUS  ROLE_ADMIN_SCHOOL  ROLE_ADMIN_ICB  ROLE_ADMIN_PROVIDER  ROLE_USER
        canteenPersonVoList: '[{bizid:"6298451491896164352",name:"cx123456"},{bizid:"6298451491896164353",name:"xc123456"}]'
    });
}

module.exports = config;
