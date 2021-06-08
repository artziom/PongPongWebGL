export namespace Event {
    export enum Type {
        KeyPressed,
        KeyReleased
    }

    export class Key {
        type: Type;
        code: string;
        alt: boolean;
        control: boolean;
        shift: boolean;

        constructor(type: Event.Type, code: string, alt: boolean, control: boolean, shift: boolean) {
            this.type = type;
            this.code = code;
            this.alt = alt;
            this.control = control;
            this.shift = shift;
        }
    }
}