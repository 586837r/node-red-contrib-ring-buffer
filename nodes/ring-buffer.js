module.exports = function (RED) {
    function RingBufferNode(config) {
        RED.nodes.createNode(this, config);

        class RingBuffer {
            constructor(n) {
                this.capacity = n + 1;
                this.clear();
            }

            incr(i) { 
                return (i + 1) % this.capacity;
            }
            decr(i) { 
                return ((i + this.capacity) - 1) % this.capacity;
            }

            incrBegin() { 
                this._begin = this.incr(this._begin);
            }
            decrBegin() { 
                this._begin = this.decr(this._begin);
            }

            incrEnd() { 
                this._end = this.incr(this._end);
            }
            decrEnd() { 
                this._end = this.decr(this._end);
            }

            front() {
                return this.empty() ? null : this._array[this._begin];
            }
            back() {
                return this.empty() ? null : this._array[this.decr(this._end)];
            }

            size() {
                if(this._begin <= this._end) {
                    return this._end - this._begin;
                }
                else {
                    return (this.capacity - this._begin) + this._end;
                }
            }
            empty() {
                return this._begin == this._end;
            }

            full() {
                return this._begin == this.incr(this._end);
            }

            push(v) {
                this._array[this._end] = v;
                this.incrEnd();
                if (this._end == this._begin) {
                    this.incrBegin();
                }
            }
            clear() {
                this._array = new Array(this.capacity);
                this._begin = 0;
                this._end = 0;
            }

            forEach(callback) {
                let iter = this._begin;
                let counter = 0;
                while (iter != this._end) {
                    let value = this._array[iter];
                    callback(value, counter);
                    iter = this.incr(iter);
                    counter++;
                }
            }

            forEachReverse(callback) {
                let iter = this.decr(this._end);
                let counter = 0;
                while(iter != this.decr(this._begin)) {
                    let value = this._array[iter];
                    callback(value, counter);
                    iter = this.decr(iter);
                    counter++;
                }
            }

            toArray() {
                let arr = [];
                this.forEach(v => arr.push(v));
                return arr;
            }

            toArrayReversed(){
                let arr = [];
                this.forEachReverse(v => arr.push(v));
                return arr;
            }
        }

        this.orderReversed = config.order === 'new-to-old';
        this.extra = config.extra;
        this.pushAfterClear = config.pushAfterClear;
        this.sendOnlyIfFull = config.sendOnlyIfFull;
        this.perTopic = config.perTopic;
        this.capacity = parseInt(config.capacity);

        this.ringBuffers = {};

        this.status({ fill: 'grey', shape: 'ring', text: '0' });
        this.on('input', function (msg) {

            const topic = config.perTopic && msg.topic ? msg.topic : 'default';

            if(msg.clearAll) {
                this.ringBuffers = {};
                this.status({ fill: 'grey', shape: 'ring', text: '0' });
                return;
            }

            if (msg.clear) {
                delete this.ringBuffers[topic];
            }

            if (((!msg.clear && !msg.clearAll) || this.pushAfterClear) && msg.payload !== undefined) {
                const ringBuffer = this.ringBuffers[topic] || (this.ringBuffers[topic] = new RingBuffer(this.capacity));
                ringBuffer.push(msg.payload);
            }      

            if (this.extra) {
                const ringBuffer = this.ringBuffers[topic] || (this.ringBuffers[topic] = new RingBuffer(this.capacity));
                msg.capacity = ringBuffer.capacity - 1;
                msg.size = ringBuffer.size();
                msg.oldest = ringBuffer.front();
                msg.newest = ringBuffer.back();
            }

            const limitString = (str, len) => str.length <= len ? str.substring(0, len) : str.substring(0, len - 3) + "...";

            this.status({
                fill: 'grey', 
                shape: Object.keys(this.ringBuffers).length === 0 ? 'ring' : 'dot', 
                text: limitString(Object.values(this.ringBuffers).map(rb => rb.size()).join(', '), 32)
            })

            if(!this.sendOnlyIfFull || this.ringBuffer.full()) {
                const ringBuffer = this.ringBuffers[topic] || (this.ringBuffers[topic] = new RingBuffer(this.capacity));
                msg.payload = this.orderReversed ? ringBuffer.toArrayReversed() : ringBuffer.toArray();
                this.send(msg);
            }
        });
    }
    
    RED.nodes.registerType("ring-buffer", RingBufferNode);
}