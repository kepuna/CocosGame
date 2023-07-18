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
    cellAreaNode: cc.Node = null;
    @property(cc.Prefab)
    cellPrefab: cc.Prefab = null;

    // cell细胞的size
    maxSize: number = 10;
    // 容器中能容纳cell的最大个数
    maxWidthCount: number = 0;
    maxHeightCount: number = 0;


    cellNodeArray = [];

    // 计时
    tt: number = 0;
    pause: boolean = true;

    onLoad() {
        this.maxWidthCount = this.cellAreaNode.width / this.maxSize;
        this.maxHeightCount = this.cellAreaNode.height / this.maxSize;

        for (let i = 0; i < this.maxHeightCount; i++) {
            this.cellNodeArray[i] = [];
            for (let j = 0; j < this.maxWidthCount; j++) {
                let cellNode = cc.instantiate(this.cellPrefab);
                cellNode.setPosition(cc.v2(0, 0));
                cellNode.setPosition(cc.v2(j * this.maxSize, i * this.maxSize));
                // 拿到cell脚本调用setState
                cellNode.getComponent('cell').setState(0);
                this.cellAreaNode.addChild(cellNode);
                this.cellNodeArray[i][j] = cellNode;
            }

        }

        //cellAreaNode监听点击事件
        this.cellAreaNode.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    }

    onTouchStart(event: cc.Event.EventTouch) {
        // 这里拿到的坐标是世界坐标，需要进行转换
        let world_pos = event.getLocation();
        // 将世界坐标转换成节点坐标
        let node_pos = this.cellAreaNode.convertToNodeSpaceAR(world_pos);
        let i = Math.floor(node_pos.y / this.maxSize);
        let j = Math.floor(node_pos.x / this.maxSize);
        let cellNode = this.cellNodeArray[i][j];
        cellNode.getComponent('cell').switchState();
    }

    lifeChange() {
        let nowStateMap = [];// 当前细胞状态
        let nextStateMap = []; // 下一次细胞的状态

        for (let i = 0; i < this.maxHeightCount; i++) {
            nowStateMap[i] = [];
            nextStateMap[i] = [];
            for (let j = 0; j < this.maxWidthCount; j++) {
                let cellState = this.cellNodeArray[i][j].getComponent('cell').state;
                nowStateMap[i][j] = cellState;
                nextStateMap[i][j] = cellState;
            }
        }

        //

        for (let i = 0; i < this.maxHeightCount; i++) {
            for (let j = 0; j < this.maxWidthCount; j++) {
                let state = this.cellLifeCheck(nowStateMap, { i, j });
                if (state == 1 || state == 0) {
                    nextStateMap[i][j] = state;
                }
            }
        }
        for (let i = 0; i < this.maxHeightCount; i++) {
            for (let j = 0; j < this.maxWidthCount; j++) {
                let cellState = nextStateMap[i][j];
                this.cellNodeArray[i][j].getComponent('cell').setState(cellState);
            }
        }
    }

    pauseGame() {
        this.pause = !this.pause;
        cc.find('Canvas/bg/pauseBtn/Background/Label').getComponent(cc.Label).string = !this.pause ? 'Pause' : 'Start';
    }

    cellLifeCheck(stateMap, index) {
        // 偏移量
        let grid = [
            { i: 1, j: -1 }, { i: 1, j: 0 }, { i: 1, j: 1 },
            { i: 0, j: -1 }, { i: 0, j: 1 },
            { i: -1, j: -1 }, { i: -1, j: 0 }, { i: -1, j: 1 },
        ];
        // 有几个生的细胞
        let totalLife = 0;

        for (let g of grid) {
            let i = g.i + index.i;
            let j = g.j + index.j;

            if (i >= this.maxHeightCount) {
                i = 0;
            }
            if (j >= this.maxWidthCount) {
                j = 0;
            }
            if (i < 0) {
                i = this.maxHeightCount - 1;
            }
            if (j < 0) {
                j = this.maxWidthCount - 1;
            }
            let cellState = stateMap[i][j];
            if (cellState != 0) totalLife++;
        }
        if (totalLife == 3) {
            return 1; // 存活
        } else if (totalLife == 2) {
            return - 1; // 不变
        } else {

        }
    }

    update(dt) {
        if (this.pause) {
            return;
        }
        this.tt += dt;
        // 每0.1s 执行一次
        if (this.tt >= 0.1) {
            this.tt = 0;
            this.lifeChange();
        }
    }
}
