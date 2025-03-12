// dynamically creates CRUD functions for models

import { create } from "./create.js";
import { read } from "./read.js";
import { update } from "./update.js";
import { remove } from "./delete.js";

export const createCRUDController = (Model) => ({
    create: async (req, res) => create (Model, req, res),
    read: async (req, res) => read (Model, req, res),
    update: async (req, res) => update (Model, req, res),
    remove: async (req, res) => remove (Model, req, res)
})