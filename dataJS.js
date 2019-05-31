const fs = require('fs');

function log(msg) {
  fs.appendFileSync('dataJS-log.txt', `On ${new Date() + ""}: ${msg}\n`, console.error)
}

function createDatabase(name) {
  if (!fs.existsSync('data')) {
    fs.mkdirSync('data')
  }
  fs.writeFileSync(`data/${name}.json`, "{\n\t\n}")
  log(`Database ${name} created.`)
}

function deleteDatabase(name) {
  try {
    fs.accessSync(`data/${name}.json`, fs.constants.F_OK)
    fs.unlinkSync(`data/${name}.json`);
    log(`Database ${name} deleted.`);
  } catch (e) {
    throw new Error('Database non-existent.')
  }
}

function createTable(name, db, columns) {
  if (!fs.existsSync(`data/${db}.json`)) {
    throw new Error('Database non-existent.')
  }
  return new Table(name, columns, db);
}

function deleteTable(name, db) {
  if (!fs.existsSync(`data/${db}.json`)) {
    throw new Error('Database non-existent.')
  } else {
    let _ = JSON.parse(fs.readFileSync(`data/${db}.json`, {
      encoding: 'utf8'
    }));
    if (!_[name]) {
      throw new Error('Table non-existent.')
    } else {
      delete _[name];
      fs.writeFileSync(`data/${db}.json`, JSON.stringify(_, undefined, 2))
    }
  }
}
class Table {
  constructor(name, columns, database) {
    if (fs.existsSync(`data/${database}.json`)) {
      this._name = name;
      this._fullName = `${database}:${name}`
      this._columns = columns;
      this._url = `data/${database}.json`
      this._localContent = [];
      log(`New table ${this._fullName} created for database ${database}.`);
    } else {
      log(`Table creation insuccessful: database ${database} non-existent.`)
    }
    return this;
  }

  insertRow(...values) {
    let _ = 0;
    let __ = {};
    let columns = this._columns;
    for (const i in columns) {
      if (values[i]) {
        _++;
        __[columns[i]] = values[i];
      }
    }
    if (!(_ === columns.length)) {
      throw new Error('Values inserted are missing.');
    }
    this._localContent.push(__);
    log(`Row inserted into ${this._fullName}`)
    return this;
  }
  insertRows(...arrayOfValues) {
    for (const i of arrayOfValues) {
      this.insertRow(...i);
    }
    return this;
  }
  deleteRow(index) {
    this._localContent.splice(index, 1);
    return this;
    log(`Row deleted from ${this._fullName}`)
  }
  deleteRows(from, to) {
    this._localContent.splice(from, to + 1);
    return this;
  }
  push() {
    let dbObj = JSON.parse(fs.readFileSync(this._url, {
      encoding: "utf8"
    }))
    dbObj[this._name] = this._localContent;
    fs.writeFileSync(this._url, JSON.stringify(dbObj, undefined, 2));
    log(`Table ${this._fullName} saved into database.`)
    this._localContent = null;
  }
  pull() {
    this._localContent = JSON.parse(fs.readFileSync(this._url), {
      encoding: "uft8"
    })[this._name]
    log(`Table ${this._fullName} pulled from database.`)
    return this;
  }
  get localContent() {
    return this._localContent;
  }
}

module.exports = {
  createDatabase,
  deleteDatabase,
  createTable,
  deleteTable
}