export interface IPassport {
    loginType?: string;
    timeout?: number;
    authorities?: string[];
}

export interface IPassportAction extends IPassport {
    type: string;
}
