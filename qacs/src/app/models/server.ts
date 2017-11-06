export enum serverSendTypes {
    authenticate = 'authenticate',
    message = 'message',
    ServicerOp = 'ServicerOp',
    heartbeat = 'heartbeat'
}

export enum serverGetTypes {
    authenticate = 'authenticate',
    signal = 'signal',
    message = 'message',
    warn = 'warn',
    transfer = 'transfer',
    preview = 'preview'
}
