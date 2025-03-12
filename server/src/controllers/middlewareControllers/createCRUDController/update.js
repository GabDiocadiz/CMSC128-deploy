export const update = async (Model, req, res) => {
    try {
        const updatedItem = await Model.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).json(updatedItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}