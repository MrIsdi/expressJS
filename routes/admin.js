var express = require('express');
var router = express.Router();
var db = require('../lib/db')
var bcrypt = require('bcryptjs')

// Masuk ke halaman login
router.get('/login', function(req, res, next) {
  if(req.session.loggedin){
    res.redirect('/admin')
    next()
  }
  res.render('admin/login')
})

// Pengoperasian login
router.post('/login', function(req, res, next) {
  if(req.session.loggedin){
    res.redirect('/admin')
    next()
  }
  let email = req.body.email
  let password = req.body.password
  console.log(email)
  console.log(password)

  if(email && password){
    db.query('SELECT * FROM admin WHERE email = ? AND password = ?', [email, password], function(err, rows) {
      if(rows.length > 0){
        req.session.loggedin = true;
				req.session.username = rows[0].name;
        res.redirect('/admin')
      }else{
        res.send('Login gagal')
      }
      res.end()
    })
  }else{
    res.send('Login gagal')
    res.end()
  }
  
})

// Pengoperasian logout
router.get('/logout', function(req, res, next) {
  req.session.destroy(function(err){
    if(err){
      console.log(err)
    }else{
      res.redirect('/admin/login')
    }
  })
})

// Menampilkan semua data user
router.get('/', function(req, res, next) {
  if(!req.session.loggedin){
    res.redirect('/admin/login')
    next()
  }
  db.query('SELECT * FROM users', (err, rows)=>{
    if(err){
      req.flash('error', err)
      res.render('admin', 
        { data:'',
          title: 'Admin' })
    }else{
      res.render('admin', 
        { data:rows,
          title: 'Admin'})
    }
  })
});

// Mereset password user
router.get('/resetPassword/(:id)', function(req, res, next) {
  if(!req.session.loggedin){
    res.redirect('/admin/login')
    next()
  }
  let id = req.params.id
  let password = bcrypt.hashSync('password', 10)

  let data = {
    password:password
  }

  db.query('UPDATE users SET ? WHERE id = ' + id, data, function(err, result) {
    if(err){
      req.flash('error', 'Password peserta tidak berhasil direset!')
    }else{
      req.flash('success', 'Password peserta berhasil direset!')
      res.redirect('/admin')
    }
  })
})

// Menghapus data user
router.get('/delete/(:id)', function(req, res, next){
  if(!req.session.loggedin){
    res.redirect('/admin/login')
    next()
  }
  let id = req.params.id

  db.query('DELETE FROM users WHERE id = '+ id, function(err, result) {
    if(err){
      req.flash('error', 'Data peserta tidak berhasil dihapus!')
    }else{
      req.flash('success', 'Data peserta berhasil dihapus!')
      res.redirect('/admin')
    }
  })
})

// Melihat data lengkap user
router.get('/userView/(:id)', function(req, res, next) {
  if(!req.session.loggedin){
    res.redirect('/admin/login')
    next()
  }
  let id = req.params.id

  db.query('SELECT * FROM users WHERE id = ' + id, function(err, rows) {
    if(err){
      req.flash('error', 'Data peserta tidak dapat dilihat!')
      res.redirect('/admin')
    }else{
      res.render('admin/userView',{data: rows})
    }
  })
})

// Masuk ke halaman ke informasi
router.get('/information', function(req, res, next) {
  if(!req.session.loggedin){
    res.redirect('/admin/login')
    next()
  }
  db.query('SELECT * FROM informasi', (err, rows)=>{
    if(err){
      req.flash('error', err)
      res.render('admin/information')
    }else{
      res.render('admin/information', { data: rows })
    }
  })
})

// Masuk ke halaman tambah informasi
router.get('/addInformation', function(req, res, next) {
  if(!req.session.loggedin){
    res.redirect('/admin/login')
    next()
  }
  res.render('admin/addInformation')
})

// Pengoperasian Informasi
router.post('/addInformation', function(req, res, next) {
  if(!req.session.loggedin){
    res.redirect('/admin/login')
    next()
  }
  let judul = req.body.judul
  let kategori = req.body.kategori
  let hari = req.body.hari
  let tanggal = req.body.tanggal
  let waktu = req.body.waktu
  let lokasi = req.body.lokasi

  let data = {
    judul,
    kategori,
    hari,
    tanggal,
    waktu,
    lokasi
  }

  db.query('INSERT INTO informasi SET ?', data, function(err, result) {
    if(err){
      req.flash('error', err)
      res.render('admin/addInformation')
    }else{
      res.redirect('/admin/information')
    }
  })
})

// Masuk ke halaman update informasi
router.get('/updateInformation/(:id)', function(req, res, next) {
  if(!req.session.loggedin){
    res.redirect('/admin/login')
    next()
  }
  let id = req.params.id

  db.query('SELECT * FROM informasi WHERE id = ' + id, function(err, rows) {
    if(err){
      req.flash('error', 'Informasi tidak dapa ditemukan')
      res.redirect('/admin')
    }else{
      res.render('admin/updateInformation',{data: rows})
    }
  })
})

// Pengoperasian Update Informasi
router.post('/updateInformation/:id', function(req, res, next) {
  if(!req.session.loggedin){
    res.redirect('/admin/login')
    next()
  }
  let id = req.params.id
  let judul = req.body.judul
  let kategori = req.body.kategori
  let hari = req.body.hari
  let tanggal = req.body.tanggal
  let waktu = req.body.waktu
  let lokasi = req.body.lokasi

  let data = {
    judul,
    kategori,
    hari,
    tanggal,
    waktu,
    lokasi
  }

  db.query('UPDATE informasi SET ? WHERE id = ' + id, data, function(err, result) {
    if(err){
      req.flash('error', 'Informasi tidak berhasil diupdate')
    }else{
      req.flash('success', 'Informasi berhasil diupdate')
      res.redirect('/admin/information')
    }
  })
})

// Menghapus informasi
router.get('/deleteInformation/(:id)', function(req, res, next){
  if(!req.session.loggedin){
    res.redirect('/admin/login')
    next()
  }
  let id = req.params.id

  db.query('DELETE FROM informasi WHERE id = '+ id, function(err, result) {
    if(err){
      req.flash('error', 'Informasi tidak berhasil dihapus!')
    }else{
      req.flash('success', 'Informasi berhasil dihapus!')
      res.redirect('/admin/information')
    }
  })
})


module.exports = router;
