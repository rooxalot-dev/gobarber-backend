
import app from './app';

let { PORT } = process.env;

PORT = PORT || 3333;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
