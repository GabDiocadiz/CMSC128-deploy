export const read = async (Model, req, res) => {
    try {
        const items = await Model.find();
        res.status(200).json(items);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}