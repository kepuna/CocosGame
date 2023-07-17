// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

const InputMapping = new Map<number, number>();// 记录用户输入
const State = {
    stand: 1, // 站在台上
    attack: 2, // 攻击
}

@ccclass
export default class Hero extends cc.Component {

    private _speed: number = 200;
    // 当前速度
    private currentSpeed: cc.Vec2 = cc.v2(0, 0);
    // 记录人物角色状态
    private heroState = State.stand;
    // 记录人物角色 动画
    private currentAnimation = 'idle';

    private heroAnimNode = null;

    // 人物角色的线性速度
    private linearVelocity: cc.Vec2 = cc.v2(0, 0);

    // 表示连击动画的下标值 0：attack ， 1：attack2 ，2:attack3
    private comob: number = 0;

    onLoad() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        this.heroAnimNode = this.node.getChildByName('body').getComponent(cc.Animation);
        // 监听动画执行完毕
        this.heroAnimNode.on(cc.Animation.EventType.FINISHED, this.onAnimFinished, this);
    }

    protected onDestroy(): void {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        this.heroAnimNode.off(cc.Animation.EventType.FINISHED, this.onAnimFinished, this);
    }

    setAnimation(anim) {
        if (this.currentAnimation == anim) {
            return;
        }
        this.currentAnimation = anim;
        if (this.heroAnimNode) {
            this.heroAnimNode.play(anim);
        }
    }

    onAnimFinished(event, data) {
        if (data.name == 'attack' || data.name == 'attack2' || data.name == 'attack3') {
            this.heroState = State.stand;
            // this.setAnimation('idle');
            this.comob = (this.comob + 1) % 3;
        }
    }

    // 键盘按下
    onKeyDown(event) {
        InputMapping.set(event.keyCode, 1);
        // InputMapping[event.keyCode] = 1;
    }
    // 键盘抬起
    onKeyUp(event) {
        InputMapping.set(event.keyCode, 0);
        // InputMapping[event.keyCode] = 0;
    }

    update(dt) {
        let animation = this.currentAnimation;
        let scaleX = Math.abs(this.node.scaleX);

        // 拿到当前人物刚体的线性速度
        this.linearVelocity = this.node.getComponent(cc.RigidBody).linearVelocity;

        // 状态切换
        switch (this.heroState) {
            case State.stand: {
                if (InputMapping.get(cc.macro.KEY.j)) {
                    // 输入j键盘，修改状态为攻击状态
                    this.heroState = State.attack;
                }
                break;
            }
        }
        // 攻击
        if (this.heroState == State.attack) {
            if (InputMapping.get(cc.macro.KEY.j)) {
                if(this.comob == 0) {
                    animation = 'attack';
                } else if(this.comob == 1) {
                    animation = 'attack2';
                } else if(this.comob == 2) {
                    animation = 'attack3';
                }
            }
        }

        // 移动
        if (this.heroState != State.stand) {
            this.currentSpeed.x = 0;
        } else {
            this.comob = 0;
            // 左右移动
            if (InputMapping.get(cc.macro.KEY.a) || InputMapping.get(cc.macro.KEY.left)) {
                this.currentSpeed.x = -1; // left
                this.node.scaleX = -scaleX;
                animation = 'run';
            } else if (InputMapping.get(cc.macro.KEY.d) || InputMapping.get(cc.macro.KEY.right)) {
                this.currentSpeed.x = 1; // right
                this.node.scaleX = scaleX;
                animation = 'run';
            } else {
                this.currentSpeed.x = 0;
                animation = 'idle';
            }
        }


        if (this.currentSpeed.x) {
            this.linearVelocity.x = this.currentSpeed.x * this._speed;
        } else {
            this.linearVelocity.x = 0;
        }
        this.node.getComponent(cc.RigidBody).linearVelocity = this.linearVelocity;
        if (animation) {
            this.setAnimation(animation);
        }
    }
}
