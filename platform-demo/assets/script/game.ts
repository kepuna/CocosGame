// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {

    @property(cc.Node)
    mapNode: cc.Node = null;

    onLoad() {
        // 开启物理引擎
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getPhysicsManager().debugDrawFlags = 1;

        cc.director.getCollisionManager().enabled = true;
        cc.director.getCollisionManager().enabledDebugDraw = true;

        // let manager = cc.director.getCollisionManager();
        // manager.enabled = true;
        // manager.enabledDebugDraw = true;

        this.initMapNode(this.mapNode);
    }

    initMapNode(mapNode) {
        let tileMap: cc.TiledMap = mapNode.getComponent(cc.TiledMap);
        let tiledSize = tileMap.getTileSize(); // 获取地图背景中 tile 元素的大小
        let wallLayer: cc.TiledLayer = tileMap.getLayer('wall');
        let wallLayerSize: cc.Size = wallLayer.getLayerSize(); // wall layer层tile 元素的大小

        for (let i = 0; i < wallLayerSize.width; i++) {
            for (let j = 0; j < wallLayerSize.height; j++) {
                // 拿到i,j位置的小块
                let tiled: cc.TiledTile = wallLayer.getTiledTileAt(i, j, true);
                if (tiled.gid != 0) {
                    tiled.node.group = 'wall'; // 给每个小块设置group
                    // 给小块添加碰撞
                    let body = tiled.node.addComponent(cc.RigidBody);
                    body.type = cc.RigidBodyType.Static;
                    let collider = tiled.node.addComponent(cc.PhysicsBoxCollider);
                    // ??? tiledSize.width / 2, tiledSize.height / 2
                    collider.offset = cc.v2(tiledSize.width / 2, tiledSize.height / 2);
                    collider.size = tiledSize;
                    collider.apply();
                }
            }
        }
    }

    // update (dt) {}
}

