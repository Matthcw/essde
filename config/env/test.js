module.exports = {
    models: {
        connection: 'sails-memory',
        schema: true,
        migrations: 'drop'
    },
    connections: {
        memory: {
            adapter: 'sails-memory'
        }
    },
    session: {
        adapter: 'sails-memory'
    },
    csrf: false
}