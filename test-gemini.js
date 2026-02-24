const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = "AIzaSyD6np81vx40X2t1yZHrL1lsccqfYrg9byc";

async function test() {
    try {
        console.log("Listing models...");
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`;
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: "Hello" }] }] })
        });
        const data = await res.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (error) {
        console.error(error);
    }
}

test();
