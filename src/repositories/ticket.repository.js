import config from "../config/config.js";
import Ticket from "../entities/ticket.entity.js";
import TicketDaoFactory from "../factories/ticket.dao.factory.js";

class TicketRepository {
  constructor() {
    this.dao = TicketDaoFactory.create(config.PERSISTENCE);
  }

  async getAll() {
    const tickets = await this.dao.getAll();
    const list = tickets.map((ticket) => new Ticket(ticket));
    return list;
  }

  async findById(id) {
    const ticket = await this.dao.findById(id);
    const entity = new Ticket(ticket);
    return entity;
  }

  async create(payload) {
    const ticket = await this.dao.create(payload);
    const entity = new Ticket(ticket);
    return entity;
  }

  async update(id, body) {
    const ticket = await this.dao.update(id, body);
    const entity = new Ticket(ticket);
    return entity;
  }

  async delete(id) {
    await this.dao.delete(id);
    return(id);
  }
}

export default TicketRepository;
