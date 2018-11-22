module.exports = function (RED) {
    function RingBufferNode(config) {
        RED.nodes.createNode(this, config)

        class RingBuffer {
            constructor(n) {
                this.capacity = n
                this.clear()
            }

            incr(i) { return (i + 1) % this.capacity }
            decr(i) { return ((i + this.capacity) - 1) % this.capacity }

            incrBegin() { this._begin = this.incr(this._begin) }
            decrBegin() { this._begin = this.decr(this._begin) }

            incrEnd() { this._end = this.incr(this._end) }
            decrEnd() { this._end = this.decr(this._end) }

            front() {
                return this.empty() ? null : this._array[this._begin]
            }
            back() {
                return this.empty() ? null : this._array[this.decr(this._end)]
            }

            size() {
                if(this._begin <= this._end){
                    return this._end - this._begin
                }
                else{
                    return (this.capacity - this._begin) + this._end
                }
            }
            empty() {
                return this._begin == this._end
            }

            full() {
                return this._begin == this.incr(this._end)
            }

            pop() {
                if (this.empty()) return null

                let temp = this._array[this._end]
                this.decrEnd()
                if (this._end == this._begin) {
                    this.decrBegin()
                }
                return temp
            }
            push(v) {
                this._array[this._end] = v
                this.incrEnd()
                if (this._end == this._begin) {
                    this.incrBegin()
                }
            }
            clear() {
                this._array = new Array(this.capacity)
                this._begin = 0
                this._end = 0
            }

            forEach(callback) {
                let iter = this._begin
                let counter = 0
                while (iter != this._end) {
                    let value = this._array[iter]
                    callback(value, counter)
                    iter = this.incr(iter)
                    counter++
                }
            }

            forEachReverse(callback) {
                let iter = this.decr(this._end)
                let counter = 0
                while(iter != this.decr(this._begin)){
                    let value = this._array[iter]
                    callback(value, counter)
                    iter = this.decr(iter)
                    counter++
                }
            }

            toArray() {
                let arr = []
                this.forEach(v => arr.push(v))
                return arr
            }

            toArrayReversed(){
                let arr = []
                this.forEachReverse(v => arr.push(v))
                return arr
            }
        }

        this.orderReversed = config.order === 'new-to-old'
        this.extra = config.extra
        this.pushAfterClear = config.pushAfterClear
        this.sendOnlyIfFull = config.sendOnlyIfFull

        this.ringBuffer = new RingBuffer(parseInt(config.capacity) + 1)

        this.status({ fill: 'grey', shape: 'ring', text: '0' })
        this.on('input', function (msg) {

            let clear = msg.clear === true

            if (clear) {
                this.ringBuffer.clear()
            }

            if ((!clear || this.pushAfterClear) && typeof msg.payload !== 'undefined') {
                this.ringBuffer.push(msg.payload)
            }      

            if (this.extra) {
                msg.capacity = this.ringBuffer.capacity - 1
                msg.size = this.ringBuffer.size()
                msg.oldest = this.ringBuffer.front()
                msg.newest = this.ringBuffer.back()
                // msg.rb = this.ringBuffer
                // msg.ths = this
                // msg.full = this.ringBuffer.full()
            }

            this.status({ fill: 'grey', shape: this.ringBuffer.size() === 0 ? 'ring' : 'dot', text: this.ringBuffer.size() })

            if(!this.sendOnlyIfFull || this.ringBuffer.full())
            {   
                if (!this.orderReversed) {
                    msg.payload = this.ringBuffer.toArray()
                }
                else {
                    msg.payload = this.ringBuffer.toArrayReversed()
                }

                this.send(msg)
            }
        });
    }
    RED.nodes.registerType("ring-buffer", RingBufferNode)
}