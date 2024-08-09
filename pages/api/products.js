import mongoose from "mongoose";
import clientPromise from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req, res) {
    const { method } = req;
    console.log(req);
    await mongooseConnect();
    await isAdminRequest(req, res);

    if (method === 'GET') {
        if (req.query?.id) {
            res.json(await Product.findOne({ _id: req.query?.id }));
        }
        else {
            res.json(await Product.find());
        }

    }
    if (method === 'POST') {
        const { title, description, price, quantity, images, category, properties } = req.body;
        const productDoc = await Product.create({
            title, description, price, quantity, images, category, properties
        })
        res.json(productDoc);
    }

    // if (method === 'PUT') {
    //     const { title, description, price, quantity, _id } = res.body;
    //     console.log("DATA:", title, description, price, quantity, _id)
    //     await Product.updateOne({ _id }, { title, description, price, quantity });
    //     res.json(true);
    // }


    if (method === 'PUT') {
        const { title, description, price, quantity, images, category, properties, _id } = req.body;
        console.log("DATA:", title, description, price, quantity, category, properties, _id)
        try {
            await Product.updateOne({ _id }, { title, description, price, quantity, images, category, properties });
            res.json(true);
        } catch (error) {
            console.error('Error updating product:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    if (method === 'DELETE') {
        if (req.query?.id) {
            await Product.deleteOne({ _id: req.query?.id });
            res.json(true);
        }
    }
}