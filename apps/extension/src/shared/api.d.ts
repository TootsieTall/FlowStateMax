declare class API {
    private fetch;
    startSession(blockId: string): Promise<any>;
    endSession(sessionId: string): Promise<any>;
    getBlockedApps(): Promise<any>;
    getSessionStatus(): Promise<any>;
    authenticate(token: string): Promise<void>;
    logBlockBreak(appName: string, url: string, timestamp: string): Promise<any>;
}
export declare const api: API;
export {};
//# sourceMappingURL=api.d.ts.map