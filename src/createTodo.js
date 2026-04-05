// src/createTodo.js
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
const { randomUUID } = require("crypto"); // Built-in Node.js utility

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
    try {
        const body = JSON.parse(event.body || "{}");
        if (!body.name) {
            return {
                statusCode: 400,
                headers: { "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({ message: "Property 'name' is required" })
            };
        }
        const newTodo = {
            id: randomUUID(),           // Auto-generated Partition Key
            name: body.name,            // Your new attribute
            completed: false,           // Default state
            createdAt: new Date().toISOString()
        };

        const params = {
            TableName: process.env.TABLE_NAME,
            Item: newTodo
        };

        // 3. Write to DynamoDB
        await docClient.send(new PutCommand(params));

        return {
            statusCode: 201, // 201 Created is standard for successful writes
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST,OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            },
            body: JSON.stringify(newTodo),
        };
    } catch (err) {
        console.error("Error creating todo:", err);
        return {
            statusCode: 500,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ message: "Failed to create todo", error: err.message })
        };
    }
};