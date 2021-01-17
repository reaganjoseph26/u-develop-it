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
