import app from './app';

const PORT: number = parseInt(process.env.PORT as string, 10) || 3000;

app.listen(PORT, () => {
  console.log(`Server is  http://localhost:${PORT}/`);
});
