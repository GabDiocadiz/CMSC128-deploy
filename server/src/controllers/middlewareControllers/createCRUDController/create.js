export const create = async (Model, req, res) => {
    try {
        const item = await Model.create(req.body);
        res.status(201).json(item)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}