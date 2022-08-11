// const fs = require('fs')
// const express = require('express')
// const bodyParser = require('body-parser')
// const port = process.env.PORT || 3000

// const app = express()
// app.use(bodyParser.json())

// function start () {
//   app.get('/version', (req, res) => res.status(200).send('1.0.0'))

//   app.listen(port)
//   console.log('ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
// }

// start()

const express = require('express')
const consola = require('consola')
const { loadNuxt, build } = require('nuxt')
const bodyParser = require('body-parser')
const app = express()
const fs = require('fs')

const filePath = './tmp_data/list.json'

// Import and Set Nuxt.js options
const dev = process.env.NODE_ENV !== 'production'

async function start () {
  // Init Nuxt.js
  const nuxt = await loadNuxt(dev ? 'dev' : 'start')

  const { port } = nuxt.options.server
  app.get('/version', (req, res) => res.status(200).send('1.0.0'))

  app.get('/getList', (req, res) => {
    if (fs.existsSync(filePath)) {
      // path exists
      const data = JSON.parse(fs.readFileSync(filePath,
        { encoding: 'utf8', flag: 'r' }))
      res.status(200).json(data)
    } else {
      res.status(200).json([])
      console.log('DOES NOT exist:', filePath)
    }
  })

  app.post('/addToList', bodyParser.json(), (req, res) => {
    try {
      console.log(req.body)
      const newLine = req.body.newLine
      if (!newLine) {
        res.status(500).end()
      } else {
        let data
        if (fs.existsSync(filePath)) {
          data = JSON.parse(fs.readFileSync(filePath,
            { encoding: 'utf8', flag: 'r' }))
        } else { data = [] }
        data.push(newLine)
        fs.writeFileSync(filePath, JSON.stringify(data), { flag: 'w' }, function (err) {
          if (err) { throw err }
          console.log("It's saved!")
        })
        res.status(200).json(data)
      }
    } catch (e) {
      res.status(500).end()
      console.log(e)
    }

    // path exists
  })
  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Build only in dev mode
  if (dev) {
    build(nuxt)
  }

  // Listen the server
  app.listen(port, '0.0.0.0')
  consola.ready({
    message: `Server listening on http://localhost:${port}`,
    badge: true
  })
}
start()
