import { IPassport, IPassportAction } from 'models/passport';

const UPDATETYPE = 'UPDATETYPE';
const UPDATETIMEOUT = 'UPDATETIMEOUT';
const UPDATEAUTHORITIES = 'UPDATEAUTHORITIES';

const initialState: IPassport = {
  loginType: '',
  timeout: 0
};

export const passportReducer = (state: IPassport = initialState, action: IPassportAction) => {
  switch (action.type) {
    case UPDATETYPE:
      return { ...state, loginType: action.loginType };
    case UPDATETIMEOUT:
      return {
        ...state,
        timeout: action.timeout === undefined ? state.timeout - 1 : action.timeout
      };
    case UPDATEAUTHORITIES:
      return {
        ...state,
        authorities: action.authorities
      };
    default:
      return state;
  }
};

export const updateType = (loginType: string) => {
  return {
    type: UPDATETYPE,
    loginType
  };
};

export const updateTimeout = (timeout?: number) => {
  return {
    type: UPDATETIMEOUT,
    timeout
  };
};

export const updateAuthorities = (authorities: string[]) => {
  return {
    type: UPDATEAUTHORITIES,
    authorities
  };
};
