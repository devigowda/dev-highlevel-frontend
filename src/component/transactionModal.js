
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Input from "../utils/input"
import Radio from '@mui/material/Radio';
import React, { useState } from "react";
import decimalCount from "../utils/getDecimalCount"
import myConstClass from '../utils/constants';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

export default function TransModal({open,handleClose,onSubmitChange}) {
    const [inputValue, setInputValue] = useState({ amount: "", type: myConstClass.CREDIT});
    const { amount, type } = inputValue;
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputValue((prev) => ({
          ...prev,
          [name]: value,
        }));
    
        if(name === "amount"){
            if(value.length > 0 && decimalCount(value) < 5){
                setIsSubmitted(true)
            } else {
                setIsSubmitted(false)
            }
        }
      };

      const onSubmit = () =>{
        onSubmitChange(inputValue)
      }
    return (
<Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
          My Transaction
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          <Input label="Amount" type="number" name="amount" required={true} 
          onChange={handleChange} 
         value={amount} 
        error={!isSubmitted} 
          />
          <div style={{marginTop: '20px'}}> Credit: <Radio
         checked={type === myConstClass.CREDIT}
        onChange={handleChange}
         value={myConstClass.CREDIT}
        name="type"
        inputProps={{ 'aria-label': myConstClass.CREDIT }}
      />
     Debit: <Radio
        checked={type === myConstClass.DEBIT}
        onChange={handleChange}
        value={myConstClass.DEBIT}
        name="type"
        inputProps={{ 'aria-label': myConstClass.DEBIT }}
      /></div>
      <Button style={{marginTop: '30px'}} variant="contained" 
         disabled={!isSubmitted} 
         onClick={()=>onSubmitChange(inputValue)}
        >Submit</Button>
          </Typography>
        </Box>
      </Modal>
    )
}