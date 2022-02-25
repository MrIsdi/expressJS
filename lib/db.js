const mysql = require('mysql')
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'or_kmtz'
})

conn.connect((err)=>{
    if(!!err){
        console.log(err)
    }else{
        console.log('Database is connect!')
    }
})

module.exports = conn