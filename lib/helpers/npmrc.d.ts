declare function useNpmrc(name: string): void;
declare function createNpmrcs(feed: string, azProject?: string, azOrg?: string, name?: string): void;
declare function updateNpmrcWithNewPat(npmrcName?: string): void;
export { updateNpmrcWithNewPat, createNpmrcs, useNpmrc, };
