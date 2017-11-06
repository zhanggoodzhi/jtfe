import { IPassport } from 'models/passport';

const hasAccess = (passport: IPassport, access: string) => {
    const { authorities } = passport;
    return !!authorities && authorities.indexOf(access) >= 0;
};

export const isLogin = (passport: IPassport) => {
    const { authorities } = passport;
    return authorities.length > 0 && !hasAccess(passport, 'ROLE_ANONYMOUS');
};

export const isCanteen = (passport: IPassport) => {
    return hasAccess(passport, 'ROLE_ADMIN_SCHOOL');
};

export const isIcb = (passport: IPassport) => {
    return hasAccess(passport, 'ROLE_ADMIN_ICB');
};

export const isProvider = (passport: IPassport) => {
    return hasAccess(passport, 'ROLE_ADMIN_PROVIDER');
};

export const isUser = (passport: IPassport) => {
    return hasAccess(passport, 'ROLE_USER');
};
