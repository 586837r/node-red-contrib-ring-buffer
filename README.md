# node-red-contrib-ring-buffer

This is a simple ring buffer node for node-red.

- Payloads get pushed on the buffer and it returns an array sorted old to new or new to old.
- You can clear the buffer by sending a message with the property 'clear' set to true.
- If 'Add payload after clear' is enabled the payload of the message with the property 'clear' will be pushed on the buffer after clearing it.
- If 'Send only if full' is enabled this node will only send a message  if it's capacity has been reached.
- If 'Extra Info' is enabled this node will add 'size', 'capacity', 'oldest' and 'newest' properties to the message.

## Changelog

- **0.10.0**
  - added *Separate Buffer per Topic*

## Testing Example

```json
[{"id":"d7f5a932.98aec8","type":"inject","z":"709c1300.1404ec","name":"","topic":"","payload":"1","payloadType":"num","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":110,"y":180,"wires":[["ce49a827.0ef2a8"]]},{"id":"9bfe3a8c.4d4e78","type":"debug","z":"709c1300.1404ec","name":"","active":false,"tosidebar":true,"console":false,"tostatus":false,"complete":"true","x":510,"y":240,"wires":[]},{"id":"ce49a827.0ef2a8","type":"ring-buffer","z":"709c1300.1404ec","name":"","capacity":"3","order":"old-to-new","sendOnlyIfFull":false,"pushAfterClear":false,"extra":false,"x":320,"y":260,"wires":[["9bfe3a8c.4d4e78","e98881a9.49854"]]},{"id":"510a9bc0.593e04","type":"inject","z":"709c1300.1404ec","name":"","topic":"","payload":"2","payloadType":"num","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":110,"y":220,"wires":[["ce49a827.0ef2a8"]]},{"id":"9cb423ea.e420c","type":"inject","z":"709c1300.1404ec","name":"","topic":"","payload":"3","payloadType":"num","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":110,"y":260,"wires":[["ce49a827.0ef2a8"]]},{"id":"3fbf5211.cd434e","type":"inject","z":"709c1300.1404ec","name":"","topic":"","payload":"4","payloadType":"num","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":110,"y":300,"wires":[["ce49a827.0ef2a8"]]},{"id":"fed84445.8e6898","type":"inject","z":"709c1300.1404ec","name":"","topic":"","payload":"5","payloadType":"num","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":110,"y":340,"wires":[["ce49a827.0ef2a8"]]},{"id":"e98881a9.49854","type":"debug","z":"709c1300.1404ec","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"payload","x":530,"y":280,"wires":[]},{"id":"c97f1bbc.735518","type":"inject","z":"709c1300.1404ec","name":" clear","topic":"","payload":"payload added after clear","payloadType":"str","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":110,"y":400,"wires":[["102d1da4.0bef62"]]},{"id":"102d1da4.0bef62","type":"change","z":"709c1300.1404ec","name":"","rules":[{"t":"set","p":"clear","pt":"msg","to":"true","tot":"bool"}],"action":"","property":"","from":"","to":"","reg":false,"x":270,"y":400,"wires":[["ce49a827.0ef2a8"]]}]
```