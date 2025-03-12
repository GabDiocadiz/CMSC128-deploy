// dynamically creates CURD functions for models

import { create } from "./create";
import { read } from "./read";
import { update } from "./update";
import { remove } from "./delete";

export const createCRUDController = (Model) => ({
    create: (req, res) => create (Model, req, res),
    read: (req, res) => read (Model, req, res),
    update: (req, res) => update (Model, req, res),
    remove: (req, res) => remove (Model, req, res)
})