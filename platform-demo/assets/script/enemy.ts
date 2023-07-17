// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;
const State = {
    stand: 1, // 站在台上
    attack: 2, // 攻击
    hurt: 3, // 受伤
}

@ccclass
export default class Enemy extends cc.Component {

    // 血量
    private hitProgress: number = 5;
    // 是否被攻击
    private isHit: boolean = false;
    // 动画组件
    private anim = null;

    private rigidBody = null;

    private _speed: number = 80;

    // 默认的时间计时
    private tt: number = 0;

    // 记录敌人角色状态
    private enemyState = State.stand;

    // 当前速度
    private currentSpeed: cc.Vec2 = cc.v2(0, 0);

    // 角色的线性速度
    private linearVelocity: cc.Vec2 = cc.v2(0, 0);

    private moveLeft = false;
    private moveRight = false;

    // 记录人物角色 动画
    private currentAnimation = null;

    private playerNode: cc.Node = null;

    onLoad() {

        this.rigidBody = this.node.getComponent(cc.RigidBody);

        this.anim = this.node.getChildByName('body').getComponent(cc.Animation);
        // 监听hurt动画播放结束
        this.anim.on(cc.Animation.EventType.FINISHED, (event, data) => {
            if (data.name == 'hurt') {
                this.hitProgress--;
                this.isHit = false;
                this.enemyState = State.stand;
                if (this.hitProgress == 0) {
                    this.node.destroy();
                }
            } else if (data.name == 'attack') {
                this.enemyState = State.stand;
                this.setAnimation('idle');
            }
        }, this);

        this.moveLeft = false;
        this.moveRight = false;

        // setInterval(() => {
        //     this.moveLeft = !this.moveLeft;
        //     this.moveRight = !this.moveRight;
        // }, 1000);

        this.playerNode = cc.find('Canvas/bg/heroContainer')
    }

    hurt() {
        if (this.isHit) return;
        this.isHit = true;
        this.enemyState = State.hurt;

        this.linearVelocity = this.rigidBody.linearVelocity;
        this.linearVelocity.x = 0;
        this.rigidBody.linearVelocity = this.linearVelocity;

        this.setAnimation('hurt');
        // this.anim.play('hurt');
    }


    enemyAction(tt) {
        // 拿到hero的坐标
        let hero_pos = this.playerNode.position;
        let enemy_pos = this.node.position;

        // 通过计算，判断hero是否出现在敌人的视野里，出现在敌人视野里，敌人开始自动追击
        let distance = cc.Vec2.distance(enemy_pos, hero_pos);
        if (distance < 30) {
            this.moveLeft = false;
            this.moveRight = false;

            this.enemyState = State.attack;

        } else if (distance < 150) {

            let v = hero_pos.sub(enemy_pos);
            if (v.x < 0) {
                this.moveLeft = true;
                this.moveRight = false;
            } else {
                this.moveLeft = false;
                this.moveRight = true;
            }
            this.enemyState = State.stand;
        } else {
            this.moveLeft = false;
            this.moveRight = false;
            this.enemyState = State.stand;
        }
    }

    attack() {
        this.setAnimation('attack');

        // 攻击时也不希望它运动
        this.linearVelocity = this.rigidBody.linearVelocity;
        this.linearVelocity.x = 0;
        this.rigidBody.linearVelocity = this.linearVelocity;
    }
    move() {
        let scaleX = Math.abs(this.node.scaleX);
        this.linearVelocity = this.rigidBody.linearVelocity;

        // 左右移动
        if (this.moveLeft) {
            this.currentSpeed.x = -1; // left
            this.node.scaleX = -scaleX;
            this.setAnimation('run');
        } else if (this.moveRight) {
            this.currentSpeed.x = 1; // right
            this.node.scaleX = scaleX;
            this.setAnimation('run');
        } else {
            this.currentSpeed.x = 0;
            this.setAnimation('idle');
        }

        if (this.currentSpeed.x) {
            this.linearVelocity.x = this.currentSpeed.x * this._speed;
        } else {
            this.linearVelocity.x = 0;
        }
        this.rigidBody.linearVelocity = this.linearVelocity;
    }

    setAnimation(anim) {
        if (this.currentAnimation == anim) {
            return;
        }
        this.currentAnimation = anim;
        if (this.anim) {
            this.anim.play(anim);
        }
    }

    update(dt) {
        // 状态切换
        this.tt += dt;
        if (this.tt >= 0.3 && this.enemyState == State.stand) {
            this.enemyAction(dt);
            this.tt = 0;
        }

        if (this.enemyState == State.attack) {
            this.attack(); // 攻击
        } else if (this.enemyState == State.stand) {
            this.move(); // 移动
        }
    }
}
