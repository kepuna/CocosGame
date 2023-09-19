
import { createUINode, randomByRange } from "../../Utils/Utils";
import DataManager from "../../runtime/DataManager";
import ResourceManager from "../../runtime/ResourceManager";
import TileManager from "./TileManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TileMapManager extends cc.Component {
    // 实现init方法: 导入之前定义的瓦片Levels/..
    async init() {
        const { mapInfo } = DataManager.Instance //Levels[`level${1}`]
        const spriteFrames = await ResourceManager.Instance.loadPlist('ui/tile/tile/')
        // console.log(spriteFrames)
        DataManager.Instance.tileInfo = []
        for (let i = 0; i < mapInfo.length; i++) {
            const column = mapInfo[i];
            DataManager.Instance.tileInfo[i] = []
            for (let j = 0; j < column.length; j++) {
                const item = column[j];
                // 因为瓦片地图有一些是空的，所以对空的进行跳过
                if (item.src === null || item.type === null) {
                    continue
                }

                let number = item.src
                if ((number === 1 || number === 5 || number === 9) &&
                    i % 2 === 0 && j % 2 === 0) {
                    // 随机瓦片样式
                    number += randomByRange(0, 4)
                }

                const imgSrc = `tile (${number})`
                const node = createUINode()
                const spriteFrame = spriteFrames.find(v => v.name === imgSrc) || spriteFrames[0]
                const tileManager = node.addComponent(TileManager)
                const type = item.type
                tileManager.init(type, spriteFrame, i, j)
                DataManager.Instance.tileInfo[i][j] = tileManager
                this.node.addChild(node);
            }
        }
    }
}
