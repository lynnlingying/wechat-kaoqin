const router = require('koa-router')({
  prefix: '/kqapi'
})
const {kq} = require('../controllers');

router.get('/users', kq.getUsers);
router.post('/check', kq.check);
router.post('/user', kq.saveUser);
router.get('/isEarly', kq.getEarlyFlag);

module.exports = router;