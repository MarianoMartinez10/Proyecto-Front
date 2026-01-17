
import { z } from "zod";
import { ProductSchema } from "./src/lib/schemas";

const mockBackendProduct = {
    _id: "65a123...", // Mongo Style
    // id is MISSING
    name: "Gears of War",
    description: "Cool game",
    price: 59.99, // Number
    stock: 10,
    imageId: "http://example.com/img.jpg",
    platform: { id: "xbox", name: "Xbox" },
    genre: { id: "action", name: "Action" },
    type: "Digital",
    developer: "Epic",
    active: true
};

const mockBackendProductStringPrice = {
    id: "123",
    name: "Halo",
    description: "Halo game",
    price: "59.99", // String!
    stock: 5,
    imageId: "http://example.com/img.jpg",
    platform: "xbox",
    genre: "shooter",
    type: "Digital",
    developer: "Bungie",
    active: true
};

const mockGhostProduct = {
    _id: "bad-ghost",
    // No NAME
    // No PRICE
    stock: 0
};

async function test() {
    console.log("--- Testing Missing ID ---");
    try {
        const res = ProductSchema.parse(mockBackendProduct);
        console.log("Success:", res.name, res.price);
    } catch (e) {
        console.error("Failed:", e.errors || e.message);
    }

    console.log("\n--- Testing String Price ---");
    try {
        const res = ProductSchema.parse(mockBackendProductStringPrice);
        console.log("Success:", res.name, res.price);
    } catch (e) {
        console.error("Failed:", e.errors || e.message);
    }

    console.log("\n--- Testing Ghost Product (Missing Name/Price) ---");
    try {
        const res = ProductSchema.parse(mockGhostProduct);
        console.log("Success:", res.name, res.price);
    } catch (e) {
        console.error("Failed:", e.errors || e.message);
    }
}

test();
