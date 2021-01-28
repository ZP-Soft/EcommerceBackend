import 'reflect-metadata'
import 'regenerator-runtime'
import Server from './server'

const app = new Server()
app.start()