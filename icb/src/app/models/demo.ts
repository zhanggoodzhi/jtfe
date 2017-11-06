export interface User { [key: string]: string | number; }

export interface IDemoAction {
    type: string;
    users: User[];
}

export interface IDemo {
    users: User[];
}
