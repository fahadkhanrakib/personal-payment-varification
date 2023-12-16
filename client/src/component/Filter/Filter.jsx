import { useState, useEffect } from 'react';
import Transaction from './../Transaction/Transaction';
import axios from 'axios';
import './filter.css';

const Filter = () => {
  const [active, setActive] = useState({ wallet: 'all' });
  const [transaction, setTransaction] = useState([]);

  useEffect(() => {
    if (active.wallet === 'all') {
      axios
        .get('http://localhost:3000/transaction')
        .then(res => setTransaction(res.data))
        .catch(err => console.log(err));
    } else if (active.wallet === 'bkash') {
      axios
        .get('http://localhost:3000/transaction/bkash')
        .then(res => setTransaction(res.data))
        .catch(err => console.log(err));
    } else if (active.wallet === 'nagad') {
      axios
        .get('http://localhost:3000/transaction/nagad')
        .then(res => setTransaction(res.data))
        .catch(err => console.log(err));
    }
  }, [active]);

  return (
    <section className="filter_section">
      <div className="main_filter">
        <h5 className="filter_text">Filter By</h5>
        <div className="filter_option">
          <button className="bkash">Bkash</button>
          <button className="nagad">Nagad</button>
        </div>
      </div>
      <Transaction transaction={transaction}/>
    </section>
  );
};

export default Filter;
