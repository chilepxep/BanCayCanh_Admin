const { Schema, model, models } = require("mongoose");

const OrderSchema = new Schema({
    line_items: Object,
    name: String,
    address: String,
    email: String,
    phone: String,
    note: String,
    paid: Boolean,
}, { timestamps: true, });

export const Order = models?.Order || model('Order', OrderSchema);