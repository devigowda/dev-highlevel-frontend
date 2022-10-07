import TextField from '@mui/material/TextField';

const Input = ({label,name,required,value,onChange,error,type,helperTex}) =>{
    return (
        <TextField id="standard-basic" type={type} label={label} variant="standard" name={name} required={required}  onChange={onChange} value={value}error={error} helperText={helperTex}/>
    );
}

export default Input;
