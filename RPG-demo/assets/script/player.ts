// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Player extends cc.Component {

    @property(cc.Label)
    hpLabel: cc.Label = null;

    @property(cc.Label)
    apLabel: cc.Label = null;

    @property(cc.Label)
    mpLabel: cc.Label = null;

    private hp: number = 0;
    public ap: number = 0;
    private mp: number = 0;

    onLoad() {

    }

    init(hp, ap, mp) {
        this.setHP(hp);
        this.setAP(ap);
        this.setMP(mp);
    }
    setHP(hp) {
        this.hp = hp;
        this.updateHP();
    }
    updateHP() {
        this.hpLabel.string = `HP\n${this.hp}`;
    }
    setAP(ap) {
        this.ap = ap;
        this.updateAP();
    }
    getAP() {
        return this.ap;
    }
    updateAP() {
        this.apLabel.string = `AP\n${this.ap}`;
    }
    setMP(mp) {
        this.mp = mp;
        this.updateMP();
    }
    updateMP() {
        this.mpLabel.string = `MP\n${this.mp}`;
    }

    costAP(num) {
        this.ap -= num;
        this.updateAP();
    }
}
