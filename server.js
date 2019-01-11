const env = require('dotenv').config()
const express = require('express');
const morgan = require('morgan');

const app = express();

const blogPostsRouter = require('./blogPostsRouter');

app.use(morgan('common'));

app.use(express.static('public'));
app.use(express.json());

app.use('/blogPosts', blogPostsRouter);

app.listen(process.env.PORT || 3000, () => {
    console.log(`Your app is listening on port ${process.env.PORT||3000}`);
});