const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const db = require('./db/database');
const apiRoutes = require('./routes/apiRoutes');

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
//Use api routes
app.use('/api', apiRoutes);

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
