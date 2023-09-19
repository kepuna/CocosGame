import { SCENE_ENUM } from "../enums/Enums";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LoadingManager extends cc.Component {

    @property(cc.ProgressBar)
    progressBar: cc.ProgressBar = null

    onLoad() {
        this.preLoad()
    }
    // 预加载
    preLoad() {
        cc.director.preloadScene(SCENE_ENUM.Start)
        cc.resources.preloadDir('ui', cc.Asset, (current, total) => {
            if (total > 0) {
                this.progressBar.progress = current / total
            }
        }, async err => {
            if (err) {
                console.log('preLoad error ---- restart')
                await new Promise(rs => {
                    setTimeout(rs, 2000)
                })
                this.preLoad()
                return
            }
            cc.director.loadScene(SCENE_ENUM.Start)
        })
    }
}
