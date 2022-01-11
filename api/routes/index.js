var express = require('express')
var router = express.Router()
var client = require('../bd')

router.post('/login', async(req,res)=>{
  let username = req.body.username;
  let password = req.body.password;
  if(!username || !password){
    res.status(400).send("INVALID REQUEST DATA")
    return
  }
  try{
    const userType = {type: ''}
    const response = await client.query(`SELECT * FROM users WHERE username = $1 and password =$2`, [username, password])
    if(response.rowCount == 0) return res.status(404).send('No existe')
    else {
      const userID = (await client.query(`SELECT id FROM users WHERE username = $1`, [username])).rows[0].id
      const administrator = (await client.query(`SELECT 1 FROM administrators WHERE id_user=$1`, [userID])).rowCount
      const student = (await client.query(`SELECT 1 FROM students WHERE id_user=$1`, [userID])).rowCount
      const staff = (await client.query(`SELECT 1 FROM staff WHERE id_user=$1`, [userID])).rowCount
      if(administrator > 0) userType.type = 'admin'
      else if(student > 0) userType.type = 'student'
      else if(staff > 0) userType.type = 'staff'
      else{ return res.status(404).send('Not Found')}
      return res.status(200).json(userType.type)
    }
  }catch(error){
    console.error(error)
    res.status(500).json(error)
  }

})

module.exports = router;
