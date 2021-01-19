const express = require('express');
const router = express.Router();
const inputCheck = require('../../utils/inputCheck');
const db = require('../../db/database');


// return all data from the candidates table
router.get("/candidates", (req, res) => {
    const sql = `SELECT candidates.*, parties.name AS party_name
    FROM candidates
    LEFT JOIN parties
    ON candidates.party_id = parties.id`;
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
router.get('/candidate/:id', (req, res) => {
    const sql = `SELECT candidates.*, parties.name 
    AS party_name 
    FROM candidates 
    LEFT JOIN parties 
    ON candidates.party_id = parties.id 
    WHERE candidates.id = ?`;
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
router.delete("/candidate/:id", (req,res)=>{
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id]

    db.run(sql, params, function(err, result) {
        if (err) {
         res.status(404).json({error: res.message});
         return;
        }
    
        res.json({
            message: 'successfully deleted',
            changes: this.changes
            //this.changes verifies if any rows were deleted
        });
    });
});


//create a query for create operation
// Create a candidate

router.post('/candidate', ({ body }, res) => {
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
    if (errors) {
      res.status(400).json({ error: errors });
      return;
    }

    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected) 
              VALUES (?,?,?)`;
    const params = [body.first_name, body.last_name, body.industry_connected];
    // ES5 function, not arrow function, to use `this`
    db.run(sql, params, function(err, result) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }

        res.json({
            message: 'success',
            data: body,
            id: this.lastID
        });
    });
});

//route that handles updates to a candidates party affiliation
router.put('/candidate/:id', (req, res) => {
    //beginning error check makes sure the party id was provided before attempt to update the database.
    //forces a the request to include a party id property
    const errors = inputCheck(req.body, 'party_id');

    if (errors) {
    res.status(400).json({ error: errors });
    return;
    }
    
    const sql = `UPDATE candidates SET party_id = ? 
     WHERE id = ?`;
    const params = [req.body.party_id, req.params.id];
  
    db.run(sql, params, function(err, result) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
  
      res.json({
        message: 'success',
        data: req.body,
        changes: this.changes
      });
    });
});

module.exports = router;
