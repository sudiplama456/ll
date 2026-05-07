import { useState, useEffect } from 'react'
import * as api from './api'
import './App.css'

function Notification({ message, type }) {
  if (!message) return null
  return <div className={`notification ${type}`}>{message}</div>
}

function ContactForm({ onSubmit, initial, onCancel }) {
  const [name, setName]     = useState(initial?.name   || '')
  const [number, setNumber] = useState(initial?.number || '')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ name: name.trim(), number: number.trim() })
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <input
        placeholder="Full name"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />
      <input
        placeholder="Phone number"
        value={number}
        onChange={e => setNumber(e.target.value)}
        required
      />
      <div className="form-actions">
        <button type="submit">{initial ? 'Save changes' : 'Add contact'}</button>
        {onCancel && <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  )
}

function ContactCard({ contact, onDelete, onEdit }) {
  return (
    <div className="contact-card">
      <div className="contact-avatar">{contact.name[0].toUpperCase()}</div>
      <div className="contact-info">
        <span className="contact-name">{contact.name}</span>
        <span className="contact-number">{contact.number}</span>
      </div>
      <div className="contact-actions">
        <button className="btn-icon" title="Edit" onClick={() => onEdit(contact)}>✎</button>
        <button className="btn-icon btn-danger" title="Delete" onClick={() => onDelete(contact)}>✕</button>
      </div>
    </div>
  )
}

export default function App() {
  const [contacts, setContacts]   = useState([])
  const [search, setSearch]       = useState('')
  const [editing, setEditing]     = useState(null)
  const [notice, setNotice]       = useState({ message: '', type: '' })
  const [loading, setLoading]     = useState(true)

  const notify = (message, type = 'success') => {
    setNotice({ message, type })
    setTimeout(() => setNotice({ message: '', type: '' }), 3500)
  }

  useEffect(() => {
    api.getAll()
      .then(setContacts)
      .catch(() => notify('Failed to load contacts', 'error'))
      .finally(() => setLoading(false))
  }, [])

  const handleAdd = ({ name, number }) => {
    api.create({ name, number })
      .then(added => {
        setContacts(prev => [...prev, added])
        notify(`${added.name} added`)
      })
      .catch(err => {
        const msg = err.response?.data?.error || 'Failed to add contact'
        notify(msg, 'error')
      })
  }

  const handleUpdate = ({ name, number }) => {
    api.update(editing.id, { name, number })
      .then(updated => {
        setContacts(prev => prev.map(c => c.id === updated.id ? updated : c))
        setEditing(null)
        notify(`${updated.name} updated`)
      })
      .catch(err => {
        const msg = err.response?.data?.error || 'Failed to update'
        notify(msg, 'error')
      })
  }

  const handleDelete = (contact) => {
    if (!window.confirm(`Delete ${contact.name}?`)) return
    api.remove(contact.id)
      .then(() => {
        setContacts(prev => prev.filter(c => c.id !== contact.id))
        notify(`${contact.name} deleted`)
      })
      .catch(() => notify('Failed to delete', 'error'))
  }

  const filtered = contacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.number.includes(search)
  )

  return (
    <div className="app">
      <header>
        <h1>📒 Phonebook</h1>
        <p className="subtitle">{contacts.length} contact{contacts.length !== 1 ? 's' : ''}</p>
      </header>

      <Notification {...notice} />

      <section className="card">
        <h2>{editing ? `Editing: ${editing.name}` : 'Add new contact'}</h2>
        <ContactForm
          key={editing?.id ?? 'new'}
          initial={editing}
          onSubmit={editing ? handleUpdate : handleAdd}
          onCancel={editing ? () => setEditing(null) : null}
        />
      </section>

      <section className="card">
        <input
          className="search"
          placeholder="🔍  Search by name or number…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        {loading ? (
          <p className="empty">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="empty">No contacts found.</p>
        ) : (
          <div className="contact-list">
            {filtered.map(c => (
              <ContactCard
                key={c.id}
                contact={c}
                onDelete={handleDelete}
                onEdit={setEditing}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
