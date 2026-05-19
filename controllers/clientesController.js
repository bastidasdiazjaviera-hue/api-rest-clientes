const db = require('../database/db');

exports.obtenerClientes = (req, res) => {

    db.query('SELECT * FROM cliente', (err, results) => {

        if (err) {
            return res.status(500).json({ error: err });
        }

        res.status(200).json(results);
    });
};

exports.obtenerCliente = (req, res) => {

    const { id } = req.params;

    db.query(
        'SELECT * FROM cliente WHERE id_cliente = ?',
        [id],
        (err, results) => {

            if (err) {
                return res.status(500).json({ error: err });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    mensaje: 'Cliente no encontrado'
                });
            }

            res.status(200).json(results[0]);
        }
    );
};

exports.crearCliente = (req, res) => {

    const { nombre, email, telefono } = req.body;

    db.query(
        'INSERT INTO cliente (nombre, email, telefono) VALUES (?, ?, ?)',
        [nombre, email, telefono],
        (err, result) => {

            if (err) {

                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({
                        mensaje: 'El correo ya existe'
                    });
                }

                return res.status(500).json({ error: err });
            }

            res.status(201).json({
                mensaje: 'Cliente creado',
                id: result.insertId
            });
        }
    );
};

exports.actualizarCliente = (req, res) => {

    const { id } = req.params;
    const { nombre, email, telefono } = req.body;

    db.query(
        `UPDATE cliente 
         SET nombre = ?, email = ?, telefono = ?
         WHERE id_cliente = ?`,
        [nombre, email, telefono, id],
        (err, result) => {

            if (err) {
                return res.status(500).json({ error: err });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    mensaje: 'Cliente no encontrado'
                });
            }

            res.status(200).json({
                mensaje: 'Cliente actualizado'
            });
        }
    );
};

exports.eliminarCliente = (req, res) => {

    const { id } = req.params;

    db.query(
        'DELETE FROM cliente WHERE id_cliente = ?',
        [id],
        (err, result) => {

            if (err) {
                return res.status(500).json({ error: err });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    mensaje: 'Cliente no encontrado'
                });
            }

            res.status(200).json({
                mensaje: 'Cliente eliminado'
            });
        }
    );
};