import axios from 'axios'

const BASE = '/api/contacts'

export const getAll    = ()           => axios.get(BASE).then(r => r.data)
export const create    = (data)       => axios.post(BASE, data).then(r => r.data)
export const update    = (id, data)   => axios.put(`${BASE}/${id}`, data).then(r => r.data)
export const remove    = (id)         => axios.delete(`${BASE}/${id}`)
