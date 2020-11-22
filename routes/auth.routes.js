const {Router} = require('express')
const bcrypt = require('bcryptjs') //библиотека хэшурет и сравнивает пароли - безопасность от взлома
const config = require('config')
const jwt= require('jsonwebtoken')
const {check, validationResult} = require('express-validator') // для валидации
const User = require('../models/User')
const router = Router()

//потребуется обрабоать 2 пост запроса, они оформаляются следующеим образом
//for registration
router.post(
  '/register',
  //валидация при помощи express
  [
    check('email', 'Некорректный e-mail').isEmail(),
    check('password', 'Минимальная длина пароля 6 символов').isLength({min: 6})
  ],
  async (req, res) => {
    try {

      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Некорректные данные при регистрации'
        })
      }

      const {email, password} = req.body

      const candidate = await User.findOne({email})
      if (candidate) {
        return res.status(400).json({message: 'такой пользователь уже существует'})
      }
      const hashedPassword = await bcrypt.hash(password, 12)
      const user = new User({email, password: hashedPassword})

      await user.save() //ждем пока пользователь сохранится

      res.status(201).json({message: 'Пользователь создан'}) // ответ фронтэнду(когда что-то создается 201 статус) что пользователь создан

    } catch (e) {
      res.status(500).json({message: 'Что-то пошло не так, попробуйте снова...'})
    }
  })

//for login
router.post(
  '/login',
  [
    check('email', 'Введите корректный e-mail').normalizeEmail().isEmail(),
    check('password', 'Введите пароль').exists()
  ],
  async (req, res) => {
   //res.status(200).json({message:'ok'})
    try {

      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Некорректные данные при входе в систему'
        })
      }

     const {email, password} = req.body

     const user = await User.findOne({ email })
      if (!user) {
        return  res.status(400).json({message: 'Пользователь не найден'})
      }
// сравниваем пароли введенные при авторищации с БД
      const isMatch = await bcrypt.compare(password, user.password)
      //если пароли не совпадают(проверка)
      if (!isMatch) {
        return res.status(400).json({ message: 'Неверный пароль, попробуйте снова' })
      }
      //если пароли совпали- делаем авторизацию
      const token = jwt.sign(
        { userId: user.id },
        config.get('jwtSecret'),
        { expiresIn: '1h' } //период жизни токена в часах
      )
      res.json({ token, userId: user.id })

    } catch (e) {
      res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова...' })
    }
  })


module.exports = router