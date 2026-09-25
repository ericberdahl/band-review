export function localPathToHrefPath(localPath: string): string {
    return `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${localPath.replace(/^\//, '')}`
}
