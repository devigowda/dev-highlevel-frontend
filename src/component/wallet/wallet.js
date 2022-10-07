import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import React, { useState,useEffect } from "react";
import Input from "../../utils/input"
import axios from 'axios'; 
import wallet from '../../wallet.png';
import '../../App.css';
import TransModal from "../transactionModal"
import Transaction from "../transaction/transaction"
import decimalCount from "../../utils/getDecimalCount"
import myConstClass from "../../utils/constants"
import { useNavigate } from 'react-router';

function Wallet() {
  const [inputValue, setInputValue] = useState({ username: "", balance: 0 ,nameError:"",balanceError:""});
  const { username, balance } = inputValue;
  const [isSubmitted, setIsSubmitted] = useState(true);
  const [transactionId, setTransactionId] = useState(window.sessionStorage.getItem("transactionId"));
  const [walletList, setWallet] = useState({});
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  let navigate = useNavigate();

  
  useEffect(() => {
    if(transactionId){
    axios.get(myConstClass.baseUrl+"wallet/"+transactionId)
    .then(response => {
      setWallet(response.data.data)}
      )
      .catch(error => {
          console.error('There was an error!', error);
      });
    }
  },[transactionId]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    let nameError = '';
    let balanceError = '';
    setInputValue((prev) => ({
      ...prev,
      [name]: value,
    }));

    if(name === "username"){
        if(value.length > 0){
            setIsSubmitted(true)
            nameError = '';
        } else {
            setIsSubmitted(false)
            nameError = "Name field is required"
        }
    }

    if(name === "balance"){
      if(decimalCount(value) < 5){
          setIsSubmitted(true)
          balanceError = '';
      } else {
          setIsSubmitted(false)
          balanceError="Please enter upto 4 decimal value"
      }
  }
 
  setInputValue((prev) => ({
    ...prev,
    nameError: nameError,
    balanceError:balanceError
  }));
  };

  const onSubmitChange = () => {
    axios.post(myConstClass.baseUrl+'setup', inputValue)
        .then(response => {
        window.sessionStorage.setItem("transactionId", response.data.data.transactionId)
        setTransactionId(window.sessionStorage.getItem("transactionId"))})
        .catch(error => {
            console.error('There was an error!', error);
        });

  };

  const addTransaction = (transList) =>{
    const walletList = 
    axios.post(myConstClass.baseUrl+'transact/'+transactionId, transList)
    .then(response => {
      setWallet((prev) => ({
        ...prev,
        balance: response.data.data.balance,
      }));
      setOpen(false); 
  })
    .catch(error => {
        console.error('There was an error!', error);
    });
  }

  function handleClick() {
    navigate('/transaction')
  }

  return (
    <>
    {transactionId ? <>
    <h2>{walletList.username}</h2>
      <img className="image" alt='wallet' src={wallet}/>
      <h6>Balance:</h6>
      <h1 style={{color:"blue"}}>&#x20b9;{walletList.balance}</h1>
      <Button onClick={handleOpen} >Add Transaction</Button>
      <TransModal open={open} handleClose={handleClose} onSubmitChange={addTransaction}/>
      <Button onClick={handleClick}>
        View Transaction
      </Button>
      {/* <Transaction /> */}
      </>: <div style={{ display:'flex', justifyContent:'center',marginTop: '20%' }}>

     <Card sx={{ minWidth: 275 ,padding: '20px'}}> 
        <div><Input label="User Name" type="text" name="username" 
        required={true} onChange={handleChange} value={username} error={inputValue.nameError.length > 0} helperTex={inputValue.nameError} />
       </div>
        <div>
          <Input label="Balance" type="number" name="balance" error={inputValue.balanceError.length >0} required={false} onChange={handleChange} value={balance} helperTex={inputValue.balanceError} />
          
        </div>
        <Button style={{marginTop: '30px'}} variant="contained" 
        disabled={!isSubmitted} 
        onClick={onSubmitChange}
        >Submit</Button>
     </Card>
    </div>}
    </>
   
  );
}

export default Wallet;
