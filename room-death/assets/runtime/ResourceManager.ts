import Singleton from "../base/Singleton"

export default class ResourceManager extends Singleton {
    static get Instance() {
        return super.GetInstance<ResourceManager>()
    }

    // 'ui/tile/tile'
    loadPlist(path: string) {
        return new Promise<cc.SpriteFrame[]>((resolve, reject) => {
            // cc.SpriteAtlas 加载plist类型文件
            cc.resources.loadDir(path, cc.SpriteAtlas, function (err, atlas: cc.SpriteAtlas[]) {
                if (err) {
                    console.error('Failed to load plist file:', err);
                    reject(err)
                    return
                }
                if (atlas && atlas.length > 0) {
                    const spriteAtlas = atlas[0]
                    // 获取plist下的 SpriteFrames 图集
                    const spriteFrames = spriteAtlas.getSpriteFrames()
                    resolve(spriteFrames)
                } else {
                    resolve([])
                }
            })
        });
    }


    loadDir(path: string, type: typeof cc.SpriteAtlas = cc.SpriteAtlas) {
        return new Promise<cc.SpriteFrame[]>((resolve, reject) => {
            cc.resources.loadDir<cc.SpriteFrame>(path,type, function (err, res) {
                if (err) {
                    console.error('Failed to load res:', err);
                    reject(err)
                    return
                }
                resolve(res)
            })
        });
    }
}

