const express = require('express');
const { Pool } = require('pg');

const app = express();
const port1 = 3000;
const port2 = 3001;

app.use(express.static('public'));

// PostgreSQL database connection configuration
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'votes',
  password: 'password',
  port: 5432, // PostgreSQL default port
});

// Middleware to parse JSON request bodies
app.use(express.json());

// Endpoint to vote for an option
app.post('/vote/:option', async (req, res) => {
  const option = req.params.option;

  try {
    // Increment the vote count for the specified option in the database
    await pool.query('UPDATE votes SET vote_count = vote_count + 1 WHERE vote_option = $1', [option]);

    //res.status(200).json({ message: 'Vote recorded successfully.' });
    res.redirect('/results')
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while recording the vote.' });
  }
});

// Endpoint to get the current results
app.get('/results', async (req, res) => {
  try {
    // Retrieve the vote counts for all options from the database
    const result = await pool.query('SELECT * FROM votes');
    const results = result.rows;

    res.sendFile(__dirname + '/public/results.html');
    res.status(200).json(results);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching results.' });
  }
});

// Start the two servers
app.listen(port1, () => {
  console.log(`Server 1 is running on port ${port1}`);
});

app.listen(port2, () => {
  console.log(`Server 2 is running on port ${port2}`);
});
