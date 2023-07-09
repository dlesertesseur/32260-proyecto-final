
class Ticket
{
  constructor({ id, code, purchase_datetime, amount, purchaser })
  {
      this.id = id.toString();
      this.code = code;
      this.purchase_datetime = purchase_datetime;
      this.amount = amount;
      this.purchaser = purchaser;
  }
}

export default Ticket;
