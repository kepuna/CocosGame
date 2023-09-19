
import { createUINode } from "../Utils/Utils";
import Singleton from "../base/Singleton";
import { DEFAULT_DURATION, DrawManager } from "../script/UI/DrawManager";

export default class FaderManager extends Singleton {
    static get Instance() {
        return super.GetInstance<FaderManager>()
    }

    private _fader: DrawManager = null

    get fader(): DrawManager {
        if (this._fader !== null) {
            return this._fader
        }
        // 创建一个新节点
        const root = createUINode('root')
        // 将新建的节点设置为场景的根节点
        cc.director.getScene().addChild(root);
        // 设置新建的root节点为 Canvas的根节点：
        cc.Canvas.instance.node = root;

        const fadeNode = createUINode('fade')
        fadeNode.setParent(root)

        this._fader = fadeNode.addComponent(DrawManager)
        this._fader.init()

        cc.game.addPersistRootNode(root)
        return this._fader
    }

    async fadeIn(duration: number = DEFAULT_DURATION) {
        // await this.fader.fadeIn(duration)
        return this.fader.fadeIn(duration)
    }
    async fadeOut(duration: number = DEFAULT_DURATION) {
        // await this.fader.fadeOut(duration)
        return this.fader.fadeOut(duration)
    }

    async mask() {
        return this.fader.mask()
    }


}
