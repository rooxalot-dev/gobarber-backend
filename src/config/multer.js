import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

export default {
    storage: multer.diskStorage({
        destination: resolve(__dirname, '..', '..', 'temp', 'uploads'),
        filename: (req, file, cb) => {
            crypto.randomBytes(16, (err, buffer) => {
                if (err) return cb(err);

                const hexString = buffer.toString('hex');
                const extension = extname(file.originalname);
                const newFileName = `${hexString}${extension}`;

                cb(null, newFileName);
            });
        },
    }),
};
