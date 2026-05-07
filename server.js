import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3001

app.use(express.json())
app.use(express.static(path.join(__dirname, 'frontend/dist')))

// In-memory store (replace with a DB in production)
let contacts = [
  { id: 1, name: 'Alice Johnson', number: '040-1234567' },
  { id: 2, name: 'Bob Smith',    number: '050-9876543' },
  { id: 3, name: 'Carol White',  number: '044-5556789' },
]
let nextId = 4

// GET all contacts
app.get('/api/contacts', (req, res) => {
  res.json(contacts)
})

// GET single contact
app.get('/api/contacts/:id', (req, res) => {
  const contact = contacts.find(c => c.id === Number(req.params.id))
  if (!contact) return res.status(404).json({ error: 'Contact not found' })
  res.json(contact)
})

// POST new contact
app.post('/api/contacts', (req, res) => {
  const { name, number } = req.body
  if (!name || !number) return res.status(400).json({ error: 'Name and number are required' })
  if (contacts.find(c => c.name.toLowerCase() === name.toLowerCase())) {
    return res.status(409).json({ error: 'Name already exists' })
  }
  const contact = { id: nextId++, name, number }
  contacts.push(contact)
  res.status(201).json(contact)
})

// PUT update contact
app.put('/api/contacts/:id', (req, res) => {
  const { name, number } = req.body
  const idx = contacts.findIndex(c => c.id === Number(req.params.id))
  if (idx === -1) return res.status(404).json({ error: 'Contact not found' })
  contacts[idx] = { ...contacts[idx], name, number }
  res.json(contacts[idx])
})

// DELETE contact
app.delete('/api/contacts/:id', (req, res) => {
  const idx = contacts.findIndex(c => c.id === Number(req.params.id))
  if (idx === -1) return res.status(404).json({ error: 'Contact not found' })
  contacts.splice(idx, 1)
  res.status(204).end()
})

// Health check (useful for Render)
app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

// Serve frontend for all other routes (SPA fallback)
app.get('*splat', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist/index.html'))
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

export default app
