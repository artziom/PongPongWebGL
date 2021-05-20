declare module "tiny-queue"{
    class Queue<T>{
        public push(item: T): void;
        public shift(): T;
        public slice(start: number, end: number): Queue<T>;
    }
    export = Queue;
}