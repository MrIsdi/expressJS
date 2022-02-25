var express = require('express');
var dbConn = require('../lib/db');
var router = express.Router();
var bcrypt = require('bcryptjs');
var session = require('express-session');

// Masuk ke halaman registrasi
router.get('/register', function(req, res, next) {
  if(req.session.loggedin){
    res.redirect('users/dashboard',{data: req.session.rows})
    next()
  }
  res.render('users/register', { title: 'Express' });
});

// Pengoperasian registrasi
router.post('/register', function(req, res, next) {
  if(req.session.loggedin){
    res.redirect('users/dashboard',{data: req.session.rows})
    next()
  }

    let name = req.body.name
    let nim = req.body.nim
    let email = req.body.email
    let password = bcrypt.hashSync(req.body.password,10)

    if(req.body.password !== req.body.password2){
      req.flash('error', 'Registrasi gagal silahkan cek kembali data yang dimasukan!')
      res.render('users/register')
    }

    let data = {
      name:name,
      nim:nim,
      email:email,
      password:password
    }

    dbConn.query('INSERT INTO users SET ?', data, function(err, result){
      if(err){
        req.flash('error', err)
        res.render('users/register')
      }else{
        res.redirect('/users/login')
      }
    })
  
})

// Masuk ke halaman login
router.get('/login', function(req, res, next) {
  if(req.session.loggedin){
    res.redirect('/users/dashboard')
    next()
  }
  res.render('users/login')
})

// Pengoperasian login
router.post('/login', function(req, res, next) {
  if(req.session.loggedin){
    res.redirect('/users/dashboard')
    next()
  }
  let nim = req.body.nim
  let password = req.body.password

  dbConn.query('SELECT * FROM users WHERE nim = ' + nim, function(err, rows) {
    if(err){
      req.flash('error', 'Login gagal!')
      res.render('users/login')
    }else{
      if(bcrypt.compareSync(password, rows[0].password)){
        req.session.loggedin = true
        req.session.rows = rows[0]
        res.redirect('/users/dashboard')
      }else{
        req.flash('error', 'Login gagal!')
        res.render('users/login')
      }
    }
  })
  
})

// Pengoperasian logout
router.get('/logout', function(req, res, next) {
  req.session.destroy(function(err){
    if(err){
      console.log(err)
    }else{
      res.redirect('/users/login')
    }
  })
})

// Masuk ke halaman dashboard
router.get('/dashboard', function(req, res, next) {
  if(!req.session.loggedin){
    res.redirect('/users/login')
    next()
  }
  res.render('users/dashboard',{data: req.session.rows})
})

// Masuk ke halaman profil
router.get('/profile', function(req, res, next) {
  if(!req.session.loggedin){
    res.redirect('/users/login')
    next()
  }
  res.render('users/profile',{data: req.session.rows})
})

// Pengoperasian update
router.post('/update', function(req, res, next) {
  if(!req.session.loggedin){
    res.redirect('/users/login')
    next()
  }
  let id = req.body.id
  let name = req.body.name
  let email = req.body.email
  let nim = req.body.nim
  let jurusan = req.body.jurusan
  let tLahir = req.body.tLahir
  let tmpLahir = req.body.tmpLahir
  let citaCita = req.body.citaCita
  let asal = req.body.asal

  let data = {
    name,
    email,
    nim,
    jurusan,
    tLahir,
    tmpLahir,
    citaCita,
    asal
  }

  dbConn.query('UPDATE users SET ? WHERE id = ' + id, data, function(err, result) {
    if(err){
      req.flash('error', 'Data tidak berhasil diupdate')
    }else{
      req.flash('success', 'Data berhasil diupdate')
      res.redirect('/users/dashboard')
    }
  })
})

// Masuk ke halaman event
router.get('/events', function(req, res, next) {
  if(!req.session.loggedin){
    res.redirect('/users/login')
    next()
  }
  dbConn.query('SELECT * FROM informasi', (err, rows)=>{
    if(err){
      req.flash('error', err)
      res.render('users/event', 
        { data:'',
          row: '' })
    }else{
      res.render('users/event', 
        { row: rows,
          data: req.session.rows})
    }
  })
})


module.exports = router;
