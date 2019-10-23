import File from '../models/file';

class FileController {
    async store(req, res) {
        const { originalname: name, filename: path } = req.file;
        const createdFile = await File.create({
            name,
            path,
        });

        return res.status(200).json(createdFile);
    }
}

export default new FileController();
