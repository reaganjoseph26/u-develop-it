const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const sqlite3 = require('sqlite3').verbose();


// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//code connects the applicaiton to the SQLite database. 
const db = new sqlite3.Database('./db/election.db', err => {
    if (err) {
      return console.error(err.message);
    }
  
    console.log('Connected to the election database.');
  });

// return all data from the candidates table
app.get("/api/candidates", (req, res) => {
    const sql = `SELECT * FROM candidates`;
    const params = []
    db.all(sql, params, (err, rows) => {
        if(err) {
            res.status(500).json({error: err.message});
            return;
        }

        res.json({
            message: 'success',
            data: rows
        });
      });
});


// create a query for read operation
// GET a single candidate
app.get('/api/candidate/:id', (req, res) => {
    const sql = `SELECT * FROM candidates WHERE id =?`;
    const params = [req.params.id];
    db.get(sql, params, (err, row) => {
        if(err) {
          res.status(400).json({error: err.message});
          return;
        }
        res.json({
            message: 'success',
            data: row
        });
      });
})


//create a query for delete operation
// Delete a candidate; ? mark denotes a placeholder making this a prepared statement
// db.run(`DELETE FROM candidates WHERE id = ?`, 1, function(err, result) {
//     if (err) {
//       console.log(err);
//     }

//     console.log(result, this, this.changes);
//   });

//create a query for create operation
// Create a candidate
// const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected) 
//               VALUES (?,?,?,?)`;
// const params = [1, 'Ronald', 'Firbank', 1];
// // ES5 function, not arrow function, to use this
// db.run(sql, params, function(err, result) {
//   if (err) {
//     console.log(err);
//   }
//   console.log(result, this.lastID);
// });

  // Default response for any other request(Not Found) Catch all
  // route to handle user requests that aren't supported by the app,
app.use((req, res) => {
    res.status(404).end();
  });

  //Ensure Express.js(server) doesnt start before the connecttion to database has been estabished by wrapping the express.server connection in an event handler.
  db.on('open', () => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
