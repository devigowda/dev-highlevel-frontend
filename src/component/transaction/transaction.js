import React, { useState,useEffect,useMemo } from "react";
import axios from 'axios'; 
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import arrow from '../../arrow.jpg';
import Button from '@mui/material/Button';
import myConstClass from "../../utils/constants"
import { format } from 'date-fns'
import { Link } from "react-router-dom";
import { CSVLink } from "react-csv";

function Transaction() {
    const transactionId = window.sessionStorage.getItem("transactionId")
    const [transactionList, setTransaction] = useState([]);
    const [paginationConfig, setPaginationConfig] = useState({currentPage:1,skip:0,pageSize:10,totalPages:null});

      const getTransaction = (skip) =>{
        axios.get(myConstClass.baseUrl+"transactions?walletId="+transactionId+"&skip="+skip+"&limit="+paginationConfig.pageSize)
        .then(response => {
          setPaginationConfig((prev) => ({
            ...prev,
            totalPages: response.data.totalPages,
          }));
          setTransaction(response.data.data)
        }
          )
          .catch(error => {
              console.error('There was an error!', error);
          });
      }

      useEffect(() => {
        if(transactionId){
            getTransaction(paginationConfig.skip)
        }
      },[transactionId]);

      const handlePagination = (status) =>{
        const newPaginationConfig = {...paginationConfig}
        if(status === "next"){
            newPaginationConfig.currentPage = paginationConfig.currentPage+1;
            newPaginationConfig.skip = paginationConfig.skip+paginationConfig.pageSize;
        } else {
            newPaginationConfig.currentPage = paginationConfig.currentPage-1;
            newPaginationConfig.skip = paginationConfig.skip-paginationConfig.pageSize;
        }
        setPaginationConfig(newPaginationConfig)
        getTransaction(newPaginationConfig.skip)

      }
      const handleSort = (sortField) =>{
        let transactionSortList = [...transactionList]
        transactionSortList.sort((a, b) => {
            if (a[sortField] < b[sortField]) {
              return -1;
            }
            if (a[sortField] > b[sortField]) {
              return 1;
            }
            return 0;
          });
        setTransaction(transactionSortList)
      }
return(
    <>
    <h2>My Transaction</h2> 
    <CSVLink data={transactionList} 
      filename={"transaction.csv"}
      className="btn btn-primary"
      target="_blank">
       Download 
    </CSVLink>;
    <TableContainer component={Paper} style={{width: '60%',marginLeft: '20%',marginBottom: '5%'}} >
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Amount <img className="arrow" alt='Arrow' src={arrow} onClick={() => handleSort('amount')}/></TableCell>
            <TableCell>Balance</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Date <img className="arrow" alt='Arrow' src={arrow} onClick={() => handleSort('createdAt')}/></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactionList.map((row) => (
            <TableRow
              key={row._id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell> {row.type === "CREDIT" ?  "+" + row.amount  :  "-"+row.amount } </TableCell>
              <TableCell>{row.balance }</TableCell> 
              <TableCell>{row.type}</TableCell>
              <TableCell>{ format(row.date, 'dd/mm/yyyy-hh:mm:ss')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <div style={{ marginLeft: "10%",textAlign: "left"}}>
    <Link to="/">Back</Link> </div>
   <div className="pagination"><Button variant="text" disabled={paginationConfig.currentPage === 1} onClick={()=>handlePagination("prev")}>Prev</Button>
   <h5>{paginationConfig.currentPage}/{paginationConfig.totalPages} </h5>
   <Button variant="text" disabled={paginationConfig.currentPage === paginationConfig.totalPages} onClick={()=>handlePagination("next")}>Next</Button></div> 
   
    </>
 )
}
export default Transaction;