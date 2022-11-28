import react from 'react';
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const baseURL = "http://127.0.0.1:5000/inquiries/";

const emailForm = () => {
    const [phone, setPhone] = react.useState('+1');
    const [name, setName] = react.useState('');
    const [email, setEmail] = react.useState('');
    const [subject, setSubject] = react.useState('');
    const [message, setMessage] = react.useState('');
    const [err, setErr] = react.useState({});


    const [snack, setSnack] = react.useState({
        open: false,
        vertical: 'top',
        horizontal: 'right',
    });
    const { vertical, horizontal, open } = snack;

    const handleClick = (message) => {
        setSnack({ ...snack, open: true, message: message });
    };

    const handleClose = () => {
        setSnack({ ...snack, open: false });
    };

    const handleChange = (newPhone) => {
        setPhone(newPhone)
        matchIsValidTel(newPhone)
    }

    const isValidEmail = em => {
        return /\S+@\S+\.\S+/.test(em);
    }

    const sendRequest = async () => {
        if (!isValidEmail(email)) {
            setErr({ email: "Email type is invalid" });
            return;
        }
        setErr({ email: "" });
        await axios.post(baseURL, { name: name, phone: phone, email: email, subject: subject, message: message }).then((res) => {
            console.log(res);
            if (res.data.msg === "error")
                handleClick(JSON.stringify(res.data.errors));
            else if (res.data.msg === "created")
                handleClick("Successfully Created!")
            else if (res.data.condition === 'exist')
                handleClick(res.data.msg)
        })
    }

    const fetchFromServer = async () => {
        if (!isValidEmail(email)) {
            setErr({ email: "Email type is invalid" });
            return;
        }
        setErr({ email: "" });
        await axios.get(baseURL + email).then((res) => {
            if (res.data.msg === 'not found') {
                handleClick("Not Found!");
                return;
            }
            setName(res.data.result.name)
            setPhone(res.data.result.phone)
            setSubject(res.data.result.email_subject)
            setMessage(res.data.result.email_description)
        });
    }

    return (
        <Box
            component="form"
            sx={{
                '& .MuiTextField-root': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
        >
            <div>

                <TextField
                    required
                    id="outlined-required"
                    label="Name"
                    value={name}
                    onChange={(e) => { setName(e.target.value) }}
                />
                <TextField
                    required
                    error={err.email === 'Email type is invalid'}
                    id="outlined-required"
                    value={email.email}
                    label={"Email"}
                    onChange={(e) => {
                        setEmail(e.target.value)
                    }}
                />
            </div>
            <div>
                <MuiTelInput value={phone} defaultCountry="US"
                    onChange={handleChange} preferredCountries={['US']} />

                <TextField
                    required
                    id="outlined-required"
                    label="Subject"
                    value={subject}
                    onChange={(e) => { setSubject(e.target.value) }}
                />
            </div>
            <div>
                <TextField
                    id="outlined-multiline-static"
                    label="Message"
                    multiline
                    rows={5}
                    value={message}
                    onChange={(e) => { setMessage(e.target.value) }}
                />
            </div>
            <div>
                <Button variant="contained" color='error' onClick={sendRequest}>Request A Consultation</Button>
                <Button variant="contained" color='error' onClick={fetchFromServer}>Fetch From Server</Button>
            </div>

            <Snackbar
                anchorOrigin={{ vertical, horizontal }}
                open={open}
                onClose={handleClose}
                key={vertical + horizontal}
            >
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    {snack.message}
                </Alert>
            </Snackbar>
        </Box>);
}

export default emailForm;