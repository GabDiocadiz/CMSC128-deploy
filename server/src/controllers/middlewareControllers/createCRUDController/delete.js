export const remove = async (Model, req, res) => {
    try {
        const deletedItem = await Model.findByIdAndDelete(req.params.id);
        res.status(200).json(updatedItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}