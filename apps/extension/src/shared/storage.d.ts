interface StorageData {
    auth?: {
        token: string;
        userId: string;
    };
    activeSession?: any;
    monochromeEnabled?: boolean;
    blockedApps?: Array<{
        name: string;
        domain: string;
        enabled: boolean;
    }>;
}
export declare const storage: {
    init(): Promise<void>;
    get<K extends keyof StorageData>(key: K): Promise<StorageData[K] | undefined>;
    set<K extends keyof StorageData>(key: K, value: StorageData[K]): Promise<void>;
    remove(key: keyof StorageData): Promise<void>;
    clear(): Promise<void>;
};
export {};
//# sourceMappingURL=storage.d.ts.map