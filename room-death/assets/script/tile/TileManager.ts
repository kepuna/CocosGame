// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { TILE_TYPE_ENUM } from "../enums/Enums";

const { ccclass, property } = cc._decorator;

export const TILE_WIDTH = 55
export const TILE_HEIGHT = 55

@ccclass
export default class TileManager extends cc.Component {
    type: TILE_TYPE_ENUM
    moveable: boolean // 是否可走
    turnable: boolean // 是否可转

    init(type: TILE_TYPE_ENUM, spriteFrame: cc.SpriteFrame, i: number, j: number) {
        this.type = type
        if (this.type === TILE_TYPE_ENUM.WALL_ROW ||
            this.type === TILE_TYPE_ENUM.WALL_COLUMN ||
            this.type === TILE_TYPE_ENUM.WALL_LEFT_TOP ||
            this.type === TILE_TYPE_ENUM.WALL_LEFT_BOTTOM ||
            this.type === TILE_TYPE_ENUM.WALL_RIGHT_TOP ||
            this.type === TILE_TYPE_ENUM.WALL_RIGHT_BOTTOM) {
            // 墙体类型 （不可走不可转）
            this.moveable = false
            this.turnable = false
        } else if (this.type === TILE_TYPE_ENUM.CLIFF_LEFT ||
            this.type === TILE_TYPE_ENUM.CLIFF_CENTER ||
            this.type === TILE_TYPE_ENUM.CLIFF_RIGHT) {
            // 悬崖类型 （不可走可转）
            this.moveable = false
            this.turnable = true
        } else if (this.type === TILE_TYPE_ENUM.FLOOR) {
            // 地板类型 （可走可转）
            this.moveable = true
            this.turnable = true
        }

        const sprite = this.node.addComponent(cc.Sprite)
        sprite.spriteFrame = spriteFrame
        // 这里必须把 Sprite.SizeMode 设置成 CUSTOM ，不然修改 setContentSize 不起作用
        sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM
        // sprite.node.color = cc.Color.RED
        this.node.setPosition(i * TILE_WIDTH, -j * TILE_HEIGHT)
        this.node.setContentSize(TILE_WIDTH, TILE_HEIGHT)
        // sprite.node.color = new cc.Color(Math.random() * 255, Math.random() * 255, Math.random() * 255);//
        // this.node.color =  cc.Color.GREEN
    }
}
