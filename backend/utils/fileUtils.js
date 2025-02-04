const multer = require('multer')
//Image Storage Engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // Kiểm tra loại file và chọn thư mục lưu trữ tương ứng
      if (file.mimetype.startsWith('image')) {
          cb(null, './upload/images'); // Lưu ảnh vào thư mục upload/images
      } else if (file.mimetype.startsWith('audio')) {
          cb(null, './upload/audios'); // Lưu audio vào thư mục upload/audios
      } else {
          cb(new Error('Invalid file type!'), false);
      }
    },
    filename: (req, file, cb) => {
      const audioId = req.body.id; // Lấy id từ request
      if (!audioId) {
          return cb(new Error('Missing audio ID'), false);
      }
      cb(null, `${audioId}${path.extname(file.originalname)}`); // Tạo tên file dựa trên audioId
  }
  
})
// File filter to accept only images and audio files
const fileFilter = (req, file, cb) => {
  // Chỉ chấp nhận file hình ảnh và âm thanh
  const filetypes = /jpeg|jpg|png|mp3|mp4/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  if (extname) {
      return cb(null, true);
  } else {
      cb(new Error('Only .jpg, .jpeg, .png and .mp3 files are allowed!'));
  }
};

// Multer configuration
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter
});

// Creating upload endpoint for images
app.use('/images', express.static('upload/images'))
app.use('/audios', express.static('upload/audios'))

// Creating upload endpoint for images and audio files
app.post('/upload',upload.single('file'), (req, res) => {
  let fileType = req.file.mimetype.startsWith('image') ? 'images' : 'audios';
  if (!req.file) {
      return res.status(400).json({
          success: 0, 
          message: 'No file uploaded'
      });
  }
  res.json({
      success: 1,
      fileType: fileType,
      file_url: `http://localhost:${port}/${fileType}/${req.body.id}${path.extname(req.file.originalname)}`

  });
});