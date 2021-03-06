const controller = require('../controller/estabelecimento');
const router = require('express').Router();

// Create
router.post('/estabelecimentos', async (req, res) => {
    await controller.insert(req.body, (code, error, insertedId) => {

        if (insertedId) {
            return res.status(code).send({ insertedId });
        }
        return res.status(code).send(error);
    });
});

// Read one
router.get('/estabelecimentos/:id', async (req, res) => {
    await controller.getOne(req.params.id, (code, message, estabelecimento) => {
        
        if (code === 200) {
            return res.status(code).send(estabelecimento);
        }
        return res.status(code).send({ message });
    });
});

// Read many
// Search: ?search={query}
router.get('/estabelecimentos', async (req, res) => {
    const query = req.query.search;

    await controller.getMany(query, (code, message, estabelecimentos) => {

        if (code === 200) {
            return res.status(code).send(estabelecimentos);
        }
        return res.status(code).send({ message });
    });
});

// Update
router.patch('/estabelecimentos/:id', async (req, res) => {
    const _id = req.params.id;

    await controller.update(_id, req.body, (code, error, response) => {

        if (code === 200) {
            return res.status(code).send({ response });
        }
        return res.status(code).send(error);
    });
});

// Delete
router.delete('/estabelecimentos/:id', async (req, res) => {
    const _id = req.params.id;

    await controller.remove(_id, (code, error, response) => {

        if (code === 200) {
            return res.status(code).send({ response });
        }
        return res.status(code).send({ error });
    });
});

module.exports = router;