const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello, NodeJS!');
});

const user = [{
    email: 'test@mail.com',
    password: 'password123',
    firstName: 'Name',
    lastName: 'Surname'
  }];
async function create (userData){
        return user.push({
            email: userData.email,
            password: userData.password,
            firstName: userData.firstName,
            lastName: userData.lastName,
        })
    }

async function findByEmail (email) {
       return user.find(user => user.email === email);
    }


app.post('/register', async (req, res) => {
    const {email, ...rest} = req.body;
    try {
        const existingUser = await findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        await create(req.body);
        console.log('User: ', user);
        return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error registering user', error });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser= await findByEmail(email);
        console.log(existingUser);
        if (!existingUser) {
            return res.status(401).json({ message: 'Invalid email' });
        }


        if (password !== existingUser.password) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        return res.status(200).json({ message: 'Logged in!' });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
});



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});