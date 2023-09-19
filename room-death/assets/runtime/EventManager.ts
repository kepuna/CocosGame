import Singleton from "../base/Singleton";

interface IItem {
    func: Function,
    ctx: unknown
}

export default class EventManager extends Singleton {
    static get Instance() {
        return super.GetInstance<EventManager>()
    }

    private eventDict: Map<string, Array<IItem>> = new Map()

    // 注册事件. ctx:上下文
    on(eventName: string, func: Function, ctx?: unknown) {
        if (this.eventDict.has(eventName)) {
            this.eventDict.get(eventName).push({ func, ctx })
        } else {
            this.eventDict.set(eventName, [{ func, ctx }])
        }
    }

    off(eventName: string, func: Function) {
        if (this.eventDict.has(eventName)) {
            // ???  findIndex
            const index = this.eventDict.get(eventName).findIndex(i => i.func === func)
            index > -1 && this.eventDict.get(eventName).splice(index, 1)
        }
    }

    emit(eventName: string, ...parmas: unknown[]) {
        if (this.eventDict.has(eventName)) {
            this.eventDict.get(eventName).forEach(({ func, ctx }) => {
                ctx ? func.apply(ctx, parmas) : func(...parmas)
            })
        }
    }
    clear() {
        this.eventDict.clear()
    }
}