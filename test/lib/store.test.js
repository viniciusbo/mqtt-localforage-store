const assert = require('assert');
const Store = require('../../lib/store');
const localForage = require('localforage');
const memoryStorageDriver = require('localforage-memoryStorageDriver');

describe('MQTT.js localForage Store', () => {
  let store;

  before((done) => {
    localForage.defineDriver(memoryStorageDriver, done);
  });

  beforeEach(() => {
    const db = localForage.createInstance({ name: 'test', driver: memoryStorageDriver._driver });
    store = new Store(db);
  });

  afterEach((done) => store.close(done));

  it('should set default option', () => {
    assert.strictEqual(store.options.clean, true);
  });

  it('should put packet', (done) => {
    const packet = {
      messageId: 1,
      foo: 'bar',
    };

    store.put(packet, (err) => {
      store.get({ messageId: 1 }, (err, result) => {
        assert.deepEqual(result, packet);
        done();
      });
    });
  });

  it('should get packet', (done) => {
    const packet = {
      messageId: 1,
      foo: 'bar',
    };

    store.put(packet, () => {
      store.get(packet, (err, result) => {
        assert.deepEqual(result, packet);
        done();
      });
    })
  });

  it('should del packet', (done) => {
    const packet = { messageId: 1 };

    store.put(packet, () => {
      store.del(packet, (err) => {
        assert.strictEqual(err, null);
        done();
      });
    });
  });

  it('should close database', (done) => {
    store.close((err) => {
      assert.strictEqual(err, null);
      done();
    });
  });

  it('should get messages from stream', (done) => {
    const packetA = {
      messageId: 1,
      foo: 'bar',
    };

    const packetB = {
      messageId: 2,
      bar: 'foo',
    };

    const packets = [packetA, packetB];

    store.put(packetA, () => {
      store.put(packetB, () => {
        let i = 0;

        const stream = store.createStream();
        stream
          .on('data', (data) => assert.deepEqual(data, packets[i++]))
          .on('end', () => {
            // i - 1 because on the last iteration i = package.length + 1 due to i++
            assert.deepEqual(i - 1, packets.length - 1);
            done();
          });
      });
    });
  });

  it('should destroy stream', (done) => {
    const packet = {
      messageId: 1,
      foo: 'bar',
    };

    store.put(packet, () => {
      const stream = store.createStream();
      stream
        .on('data', (data) => stream.destroy())
        .on('close', done);
    });
  });

  it('should replace packet when doing put with same messageId', (done) => {
    const packetA = {
      messageId: 1,
      foo: 'bar',
    };

    const packetB = {
      messageId: 1,
      foo: null,
    };

    store.put(packetA, () => {
      store.put(packetB, () => {
        store.get({ messageId: 1 }, (err, result) => {
          assert.deepEqual(result, packetB);
          done();
        });
      });
    });
  });

  it('should return original packet on del', (done) => {
    const packet = {
      messageId: 1,
      foo: 'bar',
    };

    store.put(packet, () => {
      store.del(packet, (err, deleted) => {
        assert.deepEqual(deleted, packet);
        done();
      });
    })
  });
});
