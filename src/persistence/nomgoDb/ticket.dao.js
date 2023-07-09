import mongoose from "mongoose";
import TicketDto from "../../dtos/ticket.dto.js";
import ticketSchema from "../../models/ticket.model.js";
import config from "../../config/config.js";
import { logger } from "../../logger/index.js";

mongoose.set("strictQuery", false);
mongoose.connect(config.MONGO_URL, { dbName: config.DB_NAME }, (error) => {
  if (error) {
    logger.fatal("TicketDao -> Cannot connect to db");
    process.exit();
  }
});

class TicketDao {
  constructor() {
    this.collection = mongoose.model("tickets", ticketSchema);
  }

  async getAll() {
    const tickets = await this.collection.find().lean();
    const list = tickets.map((ticket) => {
      return new TicketDto(ticket);
    });

    return list;
  }

  async findById(id) {
    const ticket = await this.collection.findById(id);
    const ticketDto = new TicketDto(ticket);
    return ticketDto;
  }

  async create(body) {
    const ticket = await this.collection.create(body);
    const ticketDto = new TicketDto(ticket);
    return ticketDto;
  }

  async update(id, category) {
    const ticket = await this.collection.findOneAndUpdate(
      { _id: id },
      category,
      { new: true }
    );
    const ticketDto = new TicketDto(ticket);
    return ticketDto;
  }

  async delete(id) {
    const ticket = await this.collection.deleteOne({ _id: id });
    const ticketDto = new TicketDto(ticket);
    return ticketDto;
  }
}

export default TicketDao;
