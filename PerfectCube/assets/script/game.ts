// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    block: cc.Node = null;

    @property([cc.Node])
    baseAreaArray: cc.Node[] = [];
    @property([cc.Node])
    wallAreaArray: cc.Node[] = [];

    growAction = null;
    rotaAction = null;

    onDestroy() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.grow, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.stop, this);
    }
    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.grow, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.stop, this);
    }

    grow() {
        let seq = cc.sequence(cc.scaleTo(1, 4), cc.callFunc(() => {

        }));
        this.growAction = this.block.runAction(seq);
    }
    stop() {
        this.block.stopAction(this.growAction);
        // 转到0度
        this.block.runAction(cc.sequence(
            cc.rotateTo(0.15, 0),
            cc.callFunc(() => {
                if (this.block.width * this.block.scaleX <= this.baseAreaArray[1].x - this.baseAreaArray[0].x) {
                    // 跌落到屏幕外了
                    this.block.runAction(cc.sequence(
                        // 0.7秒钟跌落
                        cc.moveTo(0.7, cc.v2(0, -1000)),
                        cc.callFunc(() => {
                            this.gameOver();
                        })
                    ));
                } else {
                    // 碰撞了
                    if (this.block.width * this.block.scaleX <= this.wallAreaArray[1].x - this.wallAreaArray[0].x) {
                        this.bouce(true); // 落在卡槽里
                    } else {
                        this.bouce(false);// 落在卡槽上
                    }
                }
            })
        ));
    }
    bouce(success) {
        let desY = -(cc.winSize.height / 2 - this.baseAreaArray[0].height - this.block.width * this.block.scaleX / 2);
        // if (success) {
        //     console.log('success')
        // } else {
        //     console.log('faild')
        // }
    }

    gameOver() {
        console.log('Game Over!!!');
        cc.director.loadScene('game');
    }
}
