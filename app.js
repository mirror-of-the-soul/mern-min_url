const express = require('express')
const config = require('config')
const path = require('path')
const mongoose = require('mongoose')

const app = express()
app.use(express.json({extended: true}))

//регистрирует rout'ы  которые будут обрабатывать по-разному API запросы
app.use('/api/auth', require('./routes/auth.routes'))//авторизация, добавим middleware c помощью require() что бы не объявлять отдельные переменные
                                                     //require - динамический и его можно использовать где угодно в node js
app.use('/api/link', require('./routes/link.routes'))
app.use('/t', require('./routes/redirect.routes'))

if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, 'client', 'build')))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

const PORT = config.get('port') || 5000 //если порт не определен то по умолчанию он 5000

async function start() {
  try { //ждем пока БД подсоединиться
    await mongoose.connect(config.get('mongoUri'), {
      useUnifiedTopology: true,
      useCreateIndex: true,
      useNewUrlParser: true
    })
    app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`)) //запускаем сервак после того как подключиласб БД
    //1 пареметр передается url адрес по которому будем добавлять БД, 2 параметром пердается набор опций
  } catch (e) {
    console.log('Server Error', e.message)
    process.exit(1)
  }
}
start() //запускаем сервак

