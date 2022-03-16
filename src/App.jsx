import axios from 'axios';
import {useEffect, useState} from 'react';
import { MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBRow,MDBCol,
  MDBContainer,
  MDBBtn ,
  MDBPagination,
  MDBPaginationItem,
  MDBPaginationLink
} from 'mdb-react-ui-kit';

function App() {
  const [data, setData] = useState([]);
  const [value, setValue] = useState('');
  const [sortvalue, setSortvalue] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageLimit, setPageLimit] = useState(4);


  const sortOption = ['name', 'address' , 'email', 'phone' , 'satus'];

  useEffect(()=> {
    loadUserData(0,4,0);
  },[])  

  const loadUserData = async (start,end,increse) => {
      return await axios
      .get(`http://localhost:5000/users?_start=${start}&end=${end}`)
      .then((res) => {
        setData(res.data)
        setCurrentPage(currentPage + increse)
      })
      .catch((e)=> console.log(e))   
  }

  const handleSearch = async (e) => {
    e.prevenDefault();
    return await  axios
    .get(`http://localhost:5000/users?q=${value}`)
    .then((res) => {
      setData(res.data);
      setValue('');
    })
    .catch((e)=> console.log(e))   
  }
  const handleReset = () => {
    loadUserData(0,4,0)
  }
  
  const handleSort = async (e) => {
    let value = e.target.value
    setSortvalue(value)
    return await  axios
    .get(`http://localhost:5000/users?_sort=${value}&_order=asc`)
    .then((res) => {
      setData(res.data);
    })
    .catch((e)=> console.log(e))   
  }
  const handleFilter = async (value) => {
    return await  axios
    .get(`http://localhost:5000/users?status=${value}`)
    .then((res) => {
      setData(res.data);
    })
    .catch((e)=> console.log(e))   
  }

  const renderPagination = () => {
    if(currentPage === 0){
      return (
        <MDBPagination>
            <MDBPaginationLink>1</MDBPaginationLink>
            <MDBBtn onClick={() => loadUserData(4,8,1)}>Next</MDBBtn>
        </MDBPagination>
      )
    }else if(currentPage < pageLimit - 1 && data.length === pageLimit){
      return (
        <MDBPagination>
        <MDBBtn onClick={() => loadUserData((currentPage-1)*4,currentPage*4, -1)}>Prev</MDBBtn>
        <MDBPaginationLink>{currentPage + 1}</MDBPaginationLink>
        <MDBBtn onClick={() => loadUserData((currentPage+1)*4,(currentPage+2)*4, 1)}>Next</MDBBtn>
        </MDBPagination>
      )
    }else{
      <MDBPagination>
      <MDBBtn onClick={() => loadUserData(4,8,-1)}>Prev</MDBBtn>
      <MDBPaginationLink>{currentPage+1}</MDBPaginationLink>
      </MDBPagination>
    }
  }
  
  // console.log(data)
    return (
   <MDBContainer>
     <  form style={{
       margine: 'auto',
       padding:'15px',
       maxWidth:'400px',
        alineCenter:'center'
        }} className="d-flex input-group w-auto"
        onSubmit={handleSearch}>
          <input type="text"
          placeholder='Search by Name...'
          className='form-control'
          value={value}
          onChange={(e)=>setValue(e.target.value)}
          />
         
            <MDBBtn type='submit' color='dark' onClick={()=>handleSearch()}>Search</MDBBtn>
            <MDBBtn className='mx-2' color='info' onClick={()=>handleReset()}>Reset</MDBBtn>
         
        </form>
     <div style={{margineTop:"100px"}}>
       <h1 className='text-center'>Search ,Filter, Sort using Json Fake Reset API</h1>
       <MDBRow>
         <MDBCol size='12'>
            <MDBTable>
              <MDBTableHead dark>
                <tr>
                  <th scope='col'>No</th>
                  <th scope='col'>Name</th>
                  <th scope='col'>email</th>
                  <th scope='col'>Phone</th>
                  <th scope='col'>Address</th>
                  <th scope='col'>Status</th>
                </tr>
              </MDBTableHead>
              {
                data.length === 0 ? (
                  <MDBTableBody className='align-center mb-0'>
                    <tr>
                      <td colSpan={8} className='text-center mb-0'>No data found</td>
                    </tr>
                  </MDBTableBody>
              ):(
                data.map((item,index)=>(
                  <MDBTableBody key={index}>
                  <tr>
                    <th scope='row'>{index+1}</th>
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>{item.phone}</td>
                    <td>{item.address}</td>
                    <td>{item.status}</td>

                  </tr>
                </MDBTableBody>
                ))
              )}
            </MDBTable>
         </MDBCol>
       </MDBRow>
       <div style={{
          margine: 'auto',
          padding:'15px',
          maxWidth:'400px',
           alineCenter:'center'
        }}>{renderPagination()}</div>
     </div>
     <MDBRow>
       <MDBCol size='8'><h2>Sort by :</h2>
       <select name="" style={{width:'50%' , borderRadius:'2px' , height:'35px'}} 
       onChange={handleSort}
       value ={sortvalue}
       >
         <option >Please select value</option>
        { sortOption.map((item,index)=> (
          <option value={item} key={index}>{item}</option>
        ) )}
       </select>
       </MDBCol>
         <MDBCol size='4'><h2>Filter by status</h2>
         <MDBBtn color='successs' onClick={()=> handleFilter("Active")}>Active</MDBBtn>
         <MDBBtn color='danger' style={{margineLeft:'2px'}} onClick={()=> handleFilter("Inactive")}>Inactive</MDBBtn>
         </MDBCol>
     </MDBRow>
   </MDBContainer>
  );
}

export default App;
