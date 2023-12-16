import './transaction.css';

const Transaction = props => {
  const { transaction } = props;
  return (
    <ul>
      {transaction.map(trans => (
        <li key={trans._id}>
          <section className="transaction_info">
            <div className="wallet_img">
              <img src={`./src/assets/${trans.wallet}.png`} alt="" />
            </div>
            <div className="wallet_info">
              <h5 className="type">{trans.operationType}</h5>
              <h5 className="sender">{trans.sender}</h5>
              <p className="transID">Trans ID: {trans.transactionID}</p>
              <div className="time_date">
                <p>
                  {trans.transactionTime}, {trans.transactionDate}
                </p>
              </div>
            </div>
            <div className="amount_info">
              <p className="amount">+ ৳{trans.amount}</p>
              <p className="fee">Charge ৳{trans.fee}</p>
            </div>
          </section>
        </li>
      ))}
    </ul>
  );
};

export default Transaction;
