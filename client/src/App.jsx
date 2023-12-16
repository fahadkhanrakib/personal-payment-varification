import { useState, useEffect } from 'react';
import axios from 'axios';
import Transaction from './component/Transaction/Transaction';
import Filter from './component/Filter/Filter';

const App = () => {
  const [transaction, setTransaction] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:3000/transaction')
      .then(res => setTransaction(res.data.slice().reverse()))
      .catch(err => console.log(err));
  }, []);

  return (
    <>
      <Filter />
      <Transaction transaction={transaction} />
    </>
  );
};

export default App;
