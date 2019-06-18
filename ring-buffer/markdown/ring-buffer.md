Simple ring buffer node.

---

### **Inputs**
 - **payload**
   - the value to be added to the buffer
 - **clear**
   - if truthy this will clear the buffer
 - **clearAll**
   - if truthy this will clear all buffers

---

### **Outputs**
 - **payload**
   - the stored payloads either new to old or old to new
 - **newest, oldest, size, capacity**
   - optional output if *Extra Info* is enabled

---

### **References**
 - [npm](https://npmjs.com/package/node-red-contrib-ring-buffer) - the nodes npm repository
 - [GitHub](https://github.com/586837r/node-red-contrib-ring-buffer) - the nodes GitHub repository