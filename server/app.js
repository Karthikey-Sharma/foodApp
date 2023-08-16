let express = require('express');
const userModel = require('./models/userModel');
const app = express();
const cors=require('cors');
app.use(cors());
const cookieParser = require('cookie-parser');
const userRouter = require('./Routers/userRouter');
const authRouter = require('./Routers/authRouter');
const planRouter = require('./Routers/planRouter')
const reviewRouter = require('./Routers/reviewRouter')
const bookingRouter = require('./Routers/bookingRouter')
// middleware function-> post , front->json
app.use(express.json())
app.use(cookieParser());
// Password = 1r4iUm6EaxeZkky8   Username = admin
// mini app
app.use("/user" , userRouter);
app.use('/auth' , authRouter);
app.use('/plans' , planRouter);
app.use("/review", reviewRouter);
app.use('/booking' , bookingRouter);
app.listen(5000);