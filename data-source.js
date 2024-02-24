const { DataSource } = require("typeorm");
const { Ride } = require("./entities/ride.entity"); // Adjust the path as necessary

const AppDataSource = new DataSource({
    type: "sqlite",
    database: "./data/db.sqlite", // Path to your SQLite database file.
    entities: [Ride],
    synchronize: true, // Be cautious with this in production!
    logging: false,
});

module.exports = { AppDataSource };
