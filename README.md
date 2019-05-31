# DataJS

This is a simple database for Node.js.

## Functions
### `createDatabase`
_Creates a database._
Parameters:
- `name`: The name of the database.
### `deleteDatabase`
_Deletes a database._
Parameters:
- `name`: The name of the database.
### `createTable`
_Creates a table for a database._
Parameters:
- `name`: The name of the table.
- `db`: The database to connect the table to.
- `columns`: The columns to use for the table.
Returns the table created.
### `deleteTable`
_Deletes a table for a database._
Parameters:
- `name`: The name of the table deleted.
- `db`: The database the table is connected to.
## `Table` Class Methods
### `Table#insertRow`
_Inserts a row into a table._
Parameters:
- `values`: The values to insert. (Rest/spread parameter)
Returns the table for chaining.
### `Table#insertRows`
_Inserts multiple rows into a table._
Parameters:
- `values`: The arrays of values to insert. (Rest/spread parameter)
Returns the table for chaining.
### `Table#deleteRow`
_Deletes a row from the table._
Parameters:
- `index`: The index of the row to delete.
Returns the table for chaining.
### `Table#deleteRows`
_Deletes multiple rows from the table._
Parameters:
- `startIndex`: The first index to delete.
- `endIndex`: The last index to delete (inclusive).
Returns the table for chaining.
### `Table#push`
_Pushes the local data into the database and clears the local data._
### `Table#pull`
_Pulls data from the database into the local data._
### `get Table#localContent`
_Gets the local data._
