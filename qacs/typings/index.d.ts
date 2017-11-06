declare const fch: (input: RequestInfo, init?: RequestInit) => Promise<any>;

declare const process;

declare const ctx: string;

interface Window {
    __INITIAL_STATE__?: any;
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: any;
    AudioContext: any;
    webkitAudioContext: any;
    webkitGetUserMedia: any;
    webkitURL: any;
}

interface Navigator {
    mediaDevices
}

declare module '*.less' {
    const value;
    export = value;
}

declare module '*.json' {
    const value;
    export = value;
}

declare module '*.png' {
    const value;
    export = value;
}

declare module '*.mp3' {
    const value;
    export = value;
}

declare const require: any;
