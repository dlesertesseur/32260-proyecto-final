
class TicketDto
{
  constructor({ _id, code, purchase_datetime, amount, purchaser })
  {
      this.id = _id;
      this.code = code;
      this.purchase_datetime = purchase_datetime;
      this.amount = amount;
      this.purchaser = purchaser;
  }
}

export default TicketDto;
