# MQTT.js localForage Store for the browser

## Installation

### NPM

```sh
yarn add mqtt-localforage-store localforage
# or
npm install --save mqtt-localforage-store
```

### Compile yourself

```sh
git clone git@github.com:viniciusbo/mqtt-localforage-store.git && cd mqtt-localforage-store
yarn # or npm install
npm run build
cd /dist
```

Distribution bundles are located in `/dist` folder.

## Usage

```javascript
import localForage from 'localforage';
import MQTTLocalForageStore from 'mqtt-localforage-store';

// Make your own localForage instances
const incomingDb = localForage.createInstance({ name: 'incomingPackets' });
const outgoingDb = localForage.createInstance({ name: 'outgoingPackets' });

const incomingStore = MQTTLocalForageStore(incomingDb);
const outgoingStore = MQTTLocalForageStore(outgoingDb);

mqtt.connect({
  // ...
  incomingMQTTStore,
  outgoingMQTTStore,
});
```

## Test

```sh
yarn # or npm install
npm run test
```