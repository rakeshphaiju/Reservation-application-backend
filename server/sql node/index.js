const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const app = express();
const bodyparser = require('body-parser');

app.use(bodyparser.json());

const SELECT_ALL_FROM_USERS_QUERY  = 'SELECT * FROM users';


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'registration'
});

connection.connect(err => {
    if (!err)
    console.log('DB connection succeded.');
else
    console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2));
});

app.use(cors());

app.get('/', (req, res) => {
    res.send('hello world')
});

app.post('/users/add', (req, res) =>{ 
     /* const { name, Address, phone_number, ruoka,quantity, Day, time } = req.query;
 const INSERT_USERS_QUERY = `INSERT INTO users (name, Address, phone_number, ruoka, quantity, Day, time) VALUES 
    ('${name}', '${Address}', '${phone_number}', '${ruoka}', '${quantity}',  '${Day}', '${time}')`;*/

    const INSERT_USERS_QUERY = "INSERT INTO users (name, Address, phone_number, ruoka, quantity, Day, time) VALUES (' " + req.body.name +" ' , ' " + req.body.Address + " ', ' " + req.body.phone_number + " ', ' " + req.body.ruoka + " ', ' " +req.body.quantity + " ', ' " + req.body.Day + " ', ' " + req.body.time + " ' )";


    connection.query(INSERT_USERS_QUERY, (err, results) => {
        if (err){
            return res.send(err)
        }
        else {
            return res.send('Successfully added users')
        }
    });
});



app.get('/users', (req, res) =>{ 
    connection.query(SELECT_ALL_FROM_USERS_QUERY, (err, results) => {
        if(err){
            return res.send(err)
        }
        else{
            return res.json({
                data: results
            })
        }
    })
});
//Select from user id
app.get('/users/:id', (req, res) => {
    connection.query('SELECT * FROM users WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

//Delete 
app.delete('/delete/:id', (req, res) => {
    let { ID } = req.params.id;
  let sql = `DELETE FROM users WHERE ID= ${req.params.id}`;
  console.log("id: ", req.params.id);

  // delete a row with id = req.params.id
  connection.query(sql, [ID], (error, results, fields) => {
    if (error) return console.error(error.message);
    res.status(200).send(results);
    console.log("Deleted Row(s):", results.affectedRows);
  });
});



   /* res.locals.connection.query('DELETE FROM users WHERE id = '+req.body.id+ '',function(error, results, fields){
        if (error) throw error;
            res.send(JSON.stringify(results));
    });
}); */

app.listen(4000, () => {
    console.log('Listening on port 4000')

});
