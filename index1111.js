// required packages
const express = require('express')
// rowdy logger for loggin our routes
const rowdy = require('rowdy-logger')
const fs = require('fs')
const layouts = require('express-ejs-layouts')
const methodOverride = require('method-override')

// config app
const app = express()
const rowdyResults = rowdy.begin(app)
const PORT = 3000
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(express.static(__dirname + '/public')) // where the css will live
app.use(layouts) // use ejs layouts
// // method override so we can put and delete
// app.use('/dinosaurs', require('./controllers/dinosaurs'))//  <-- pulled from love it leave it
// app.use('/prehistoric-creatures', require('./controllers/prehistoric-creatures')) //  <-- pulled from love it leave it


app.use(methodOverride('_method'))




// define routes
app.get('/', (req, res) => {
  res.render('home')
})

// GET /prehistoric-creatures -- READ all pcs ~~~~~~~~~
app.get('/prehistoric-creatures', (req, res) => {
  // read the PC file
  const prehistoric = fs.readFileSync('./prehistoric-creatures.json')
  const pcData = JSON.parse(prehistoric)
  console.log(pcData)
  // send back the json
  res.render('prehistoric_creatures/index.ejs', {pcData: pcData})
})

// POST /prehistoric-creatures -- CREATE a new PC -- redirect to /prehistoric creature~~~~~~~~
app.post('/prehistoric-creatures', (req, res) => {
  // read pc file
  const prehistoric = fs.readFileSync('./prehistoric-creatures.json')
  const pcData = JSON.parse(prehistoric)

  console.log(req.body)
  // add data from the request body to the pc data
  pcData.push(req.body)

  // write the file
  fs.writeFileSync('./prehistoric_creatures.json', JSON.stringify(pcData))

  // redirect to /prehistoric-creatures
  res.redirect('/prehistoric-creatures')
})

// GET /prehistoric-creatures/new -- READ (show) a form to add a pc~~~~~~~~~~~~~
app.get('/prehistoric-creatures/new', (req, res) => {
  res.render('prehistoric-creatures/new.ejs')
}) 

// GET /prehistoric-creatures/:id -- READ one specific pc~~~~~~~~~~
app.get('/prehistoric-creatures/:id', (req, res) => {
  // get our pc data
  const prehistoric = fs.readFileSync('./prehistoric-creatures.json')
  const pcData = JSON.parse(prehistoric)

  // look up one pc with the request parameters
  const pc = pcData[req.params.id]

  // send one pc back
  res.json({ pc })
})

// GET /prehistoric-creatures/edit/:id -- READ (show) form to edit one pc~~~~~~~~~~~~
app.get('/prehistoric-creatures/edit/:id', (req, res) => {
    // get the pc info to populate the form
    const prehistoric = fs.readFileSync('./prehistoric-creatures.json')
    const pcData = JSON.parse(prehistoric)
    const pc = pcData[req.params.id]
    // render the template
  res.render('prehistoric-creatures/edit.ejs', {pc: pc, pcId: req.params.id})
})

// PUT /prehistoric-creatures/:id -- UPDATE (edit) one pc -- redirect to /prehistoric-creatures/:id~~~~~~~~~~~~~~~~~ <--- need help wit hthis one
app.put('/prehistoric-creatures/:id', (req, res) => {
    // get the pc data from our json
    const prehistoric = fs.readFileSync('./prehistoric-creatures.json')
    const pcData = JSON.parse(prehistoric)
    // find on pc from the req.params.id and use the req body to update
    pcData[req.params.id].type = req.body.type // <--- need help with this one
    pcData[req.params.id].img_url = req.body.img_url // <--- need help with this one

    // write the json file
    fs.writeFileSync('./prehistoric-creatures.json', JSON.stringify(pcData))


    // redirect to /prehistoric-creatures
    res.redirect('/prehistoric-creatures')

})

// DELETE /prehistoric-creatures/:id -- DESTROY one specific PC~~~~~~~~~~~~~~~
app.delete('/prehistoric-creatures/:id', (req, res) => {

    // get out pc json 
    const prehistoric = fs.readFileSync('./prehistoric-creatures.json')
    const pcData = JSON.parse(prehistoric)

    // remove one pc from the array -- use req. params
    pcData.splice(req.params.id, 1)

    // save prehistoric-creatures.json
    fs.writeFileSync('./prehistoric-creatures.json', JSON.stringify(pcData))

    // redirect to /prehistoric-creatures
    res.redirect('/prehistoric-creatures')
})


//open the port for app to be listening on
app.listen(PORT, () => {
    rowdyResults.print()
    console.log(`${PORT} piles of Dino Crud 💩`)
})

