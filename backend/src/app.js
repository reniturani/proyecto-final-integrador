const express = require('express');
const cors = require('cors');

const sequelize = require('./config/database');

require('./models');
const profesorRoutes = require('./routes/profesor.routes');
const materiaRoutes = require('./routes/materias.routes');
const profesorMateriaRoutes = require('./routes/profesorMateria.routes');
const estudianteRoutes = require('./routes/estudiantes.routes');
const authRoutes = require('./routes/auth.routes');

const app = express();
app.use(express.json());

app.use('/api/profesores', profesorRoutes);
app.use('/api/materias', materiaRoutes);
app.use('/api', profesorMateriaRoutes);
app.use('/api/estudiantes', estudianteRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('Backend funcionando');
});

sequelize.authenticate()
    .then(() => {
        console.log('Base de datos conectada correctamente');
        return sequelize.sync();
    })
    .then(() => {
        console.log('Tablas creadas correctamente');

        app.listen(3000, () => {
            console.log('Servidor corriendo en http://localhost:3000');
        });
    })
    .catch((error) => {
        console.error('Error:', error);
    });