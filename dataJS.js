function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

var fs = require('fs');

function log(msg) {
  fs.appendFileSync('dataJS-log.txt', "On " + (new Date() + "") + ": " + msg + "\n", console.error);
}

function createDatabase(name) {
  if (!fs.existsSync('data')) {
    fs.mkdirSync('data');
  }

  fs.writeFileSync("data/" + name + ".json", "{\n\t\n}");
  log("Database " + name + " created.");
}

function deleteDatabase(name) {
  try {
    fs.accessSync("data/" + name + ".json", fs.constants.F_OK);
    fs.unlinkSync("data/" + name + ".json");
    log("Database " + name + " deleted.");
  } catch (e) {
    throw new Error('Database non-existent.');
  }
}

function createTable(name, db, columns) {
  if (!fs.existsSync("data/" + db + ".json")) {
    throw new Error('Database non-existent.');
  }

  return new Table(name, columns, db);
}

function deleteTable(name, db) {
  if (!fs.existsSync("data/" + db + ".json")) {
    throw new Error('Database non-existent.');
  } else {
    var _ = JSON.parse(fs.readFileSync("data/" + db + ".json", {
      encoding: 'utf8'
    }));

    if (!_[name]) {
      throw new Error('Table non-existent.');
    } else {
      delete _[name];
      fs.writeFileSync("data/" + db + ".json", JSON.stringify(_, undefined, 2));
    }
  }
}

var Table =
  /*#__PURE__*/
  function() {
    "use strict";

    function Table(name, columns, database) {
      if (fs.existsSync("data/" + database + ".json")) {
        this._name = name;
        this._fullName = database + ":" + name;
        this._columns = columns;
        this._url = "data/" + database + ".json";
        this._localContent = [];
        log("New table " + this._fullName + " created for database " + database + ".");
      } else {
        log("Table creation insuccessful: database " + database + " non-existent.");
      }

      return this;
    }

    var _proto = Table.prototype;

    _proto.insertRow = function insertRow() {
      var _ = 0;
      var __ = {};
      var columns = this._columns;

      for (var _len = arguments.length, values = new Array(_len), _key = 0; _key < _len; _key++) {
        values[_key] = arguments[_key];
      }

      for (var i in columns) {
        if (values[i]) {
          _++;
          __[columns[i]] = values[i];
        }
      }

      if (!(_ === columns.length)) {
        throw new Error('Values inserted are missing.');
      }

      this._localContent.push(__);

      log("Row inserted into " + this._fullName);
      return this;
    };

    _proto.insertRows = function insertRows() {
      for (var _len2 = arguments.length, arrayOfValues = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        arrayOfValues[_key2] = arguments[_key2];
      }

      for (var _i = 0, _arrayOfValues = arrayOfValues; _i < _arrayOfValues.length; _i++) {
        var i = _arrayOfValues[_i];
        this.insertRow.apply(this, i);
      }

      return this;
    };

    _proto.deleteRow = function deleteRow(index) {
      this._localContent.splice(index, 1);

      return this;
      log("Row deleted from " + this._fullName);
    };

    _proto.deleteRows = function deleteRows(from, to) {
      this._localContent.splice(from, to + 1);

      return this;
    };

    _proto.push = function push() {
      var dbObj = JSON.parse(fs.readFileSync(this._url, {
        encoding: "utf8"
      }));
      dbObj[this._name] = this._localContent;
      fs.writeFileSync(this._url, JSON.stringify(dbObj, undefined, 2));
      log("Table " + this._fullName + " saved into database.");
      this._localContent = null;
    };

    _proto.pull = function pull() {
      this._localContent = JSON.parse(fs.readFileSync(this._url), {
        encoding: "uft8"
      })[this._name];
      log("Table " + this._fullName + " pulled from database.");
      return this;
    };

    _createClass(Table, [{
      key: "localContent",
      get: function get() {
        return this._localContent;
      }
    }]);

    return Table;
  }();

module.exports = {
  createDatabase: createDatabase,
  deleteDatabase: deleteDatabase,
  createTable: createTable,
  deleteTable: deleteTable
};