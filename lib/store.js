import { Readable } from 'readable-stream';

class Store {
  constructor(localForageDb, options) {
    this.inflights = localForageDb;
    this.options = options || {};
    this.options.clean = this.options.clean || true;
  }

  put(packet, cb) {
    this.inflights.setItem(`msgid_${packet.messageId}`, packet, cb);
  }

  createStream() {
    const stream = new Readable({ objectMode: true });
    const inflights = this.inflights;
    let destroyed = false;

    stream._read = function() {
      if (destroyed === true) {
        this.push(null);
        return;
      }

      inflights.iterate(
        (value, key) => {
          this.push(value);
          return;
        },
        (err) => this.push(null)
      );
    };

    stream.destroy = function() {
      if (destroyed) return;

      destroyed = true;

      process.nextTick(() => this.emit('close'));
    }

    return stream;
  }

  get(packet, cb) {
    this.inflights.getItem(`msgid_${packet.messageId}`, cb);
  }

  del(packet, cb) {
    this.inflights.getItem(`msgid_${packet.messageId}`, (err, result) => {
      this.inflights.removeItem(`msgid_${packet.messageId}`, (err) => {
        if (err) {
          cb(err);
          return;
        }

        cb(null, result);
      });
    });
  }

  close(cb) {
    const callback = cb || (() => {});

    if (this.options.clean === false) {
      callback(null);
      return;
    }

    this.inflights.clear(callback);
  }
}

module.exports = Store;