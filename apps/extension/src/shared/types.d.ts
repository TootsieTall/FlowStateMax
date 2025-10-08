export interface ExtensionMessage {
    type: string;
    [key: string]: any;
}
export interface BlockedApp {
    id: string;
    name: string;
    domain: string;
    enabled: boolean;
}
export interface FlowSession {
    id: string;
    startTime: string;
    endTime?: string;
    monochromeOn: boolean;
    appsBlocked: boolean;
}
export interface ExtensionState {
    authenticated: boolean;
    sessionActive: boolean;
    monochromeEnabled: boolean;
    blockedApps: BlockedApp[];
}
//# sourceMappingURL=types.d.ts.map