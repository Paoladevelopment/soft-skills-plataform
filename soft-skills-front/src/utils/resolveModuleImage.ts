const moduleImages = import.meta.glob('/src/assets/modules/**/*.{svg,png,jpg,jpeg}', {
    eager: true,
    query: '?url',
    import: 'default',
}) as Record<string, string>
  
export function resolveModuleImage(apiPath?: string): string {
    const fallback =
        moduleImages['/src/assets/modules/default-module.svg'] ??
        Object.values(moduleImages)[0]

    if (!apiPath) return fallback

    const filename = apiPath.split('/').pop()
    if (!filename) return fallback

    const hitKey = Object.keys(moduleImages).find((k) => k.endsWith(`/${filename}`))
    return hitKey ? moduleImages[hitKey] : fallback
}
  
  