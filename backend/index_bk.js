const port = 5000
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const path = require('path')
const cors = require('cors')
const exp = require('constants')
const XLSX = require("xlsx");
const fs = require("fs");
const { clearScreenDown } = require('readline')
const bcrypt = require('bcrypt')
const { BlockList } = require('net')
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }));

app.get('/',(req,res)=>{
    res.send("Express App is running")
}) 
//API Creation
app.listen(port, (error)=>{
    console.log("Server Running Port " +   port)
})
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


// Connect to mongoDB Atlas
mongoose.connect("mongodb+srv://buithiquyentran:268388@cluster0.yp6gg.mongodb.net/ToyAudio")

// Schemma for creating audio
const Audio = mongoose.model("audio",{
  
  id: { type: String, required: true, unique: true }, // Thêm trường id tùy chỉnh
  name: {
    type: String,
    required: true
  },
  singer: {
    type: Array,
    required: true
  },
  type: {
    type: String,
    // default: 'music'
  },
  view: {
    type: Number,
    default: 0
  },
  image: {
    type: String,
    // required: true
  },
  file: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now()
  }

});
app.get('/lastaudioid', async (req, res) => {
  let audios = await Audio.find({});
  if (audios.length > 0) {
      let lastAudio = audios.slice(-1)[0];
      res.json({ id: lastAudio.id });
  } else {
      res.json({ id: null });
  }
});
app.get('/lastplaylistid', async (req, res) => {
  let audios = await Playlist.find({});
  if (audios.length > 0) {
      let lastAudio = audios.slice(-1)[0];
      res.json({ id: lastAudio.id });
  } else {
      res.json({ id: null });
  }
});
// Creating API for adding audios2
app.post('/addaudio', async (req, res) => {
  let audios = await Audio.find({});
  let idNumber;
  if (audios.length > 0) {
    let lastAudio = audios.slice(-1)[0];
    let lastAudioId = lastAudio.id;
    idNumber = (parseInt(lastAudioId.slice(1)) + 1).toString();
    while (idNumber.length < 4) {
      idNumber = '0' + idNumber;
    }
  } else {
    idNumber = '0001';
  }

  let id = (req.body.type === 'podcast' ? 'P' : 'M') + idNumber;
  id = req.body.id ? req.body.id : id;

  // Kiểm tra image và file có tồn tại không
  const imageExtension = req.body.image ? path.extname(req.body.image) : '.jpg';
  const audioExtension = req.body.file ? path.extname(req.body.file) : '.mp3';

  const audio = new Audio({
    id: id,
    name: req.body.name,
    singer: req.body.singer,
    image: `http://localhost:5000/images/${id}${imageExtension}`,
    file: `http://localhost:5000/audios/${id}${audioExtension}`,
    type: req.body.type,
  });

  console.log(audio);
  await audio.save();
  console.log("Saved"); 
  res.json({
    success: 1,
    id: req.body.id,
  });
});


// Creating API for deleting audios
// app.delete('/api/audios/:id', async (req, res) => {
//   const audioId = req.params.id;

//   try {
//     // Xóa audio theo ID
//     const deletedAudio = await Audio.findOneAndDelete({id: audioId});
//     if (!deletedAudio) {
//       return res.status(404).json({ message: 'Audio not found' });
//     }
//     res.status(200).json({ message: 'Audio deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting audio:', error);
//     res.status(500).json({ message: 'Error deleting audio' });
//   }
// });
// Creating API for deleting audios
app.delete('/api/audios/:id', async (req, res) => {
  const audioId = req.params.id;
  try {
    // Xóa audio theo ID
    const deletedAudio = await Audio.findOneAndDelete({ id: audioId });
    if (!deletedAudio) {
      return res.status(404).json({ message: 'Audio not found' });
    }

    // Tìm tất cả các playlist chứa audioId trong songIds và cập nhật chúng
    await Playlist.updateMany(
      { songIds: audioId },
      { $pull: { songIds: audioId } }
    );

    res.status(200).json({ message: 'Audio deleted successfully and removed from playlists' });
  } catch (error) {
    console.error('Error deleting audio:', error);
    res.status(500).json({ message: 'Error deleting audio' });
  }
});

//Creating API for getting all products
app.get('/allaudios', async (req, res) => {
    try {
      const audios = await Audio.find({}); // Fetch all products from MongoDB
      res.status(200).json(audios); // Send products in JSON format
    } catch (error) {
      res.status(500).json({ message: 'Error fetching products', error });
    }
});
// API để tăng số lượt nghe
app.put('/api/audios/:id/view', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedAudio = await Audio.findOneAndUpdate(
      {id: id },
      { $inc: { view: 1 } },  // Tăng view thêm 1
      { new: true }  // Trả về document đã cập nhật
    );
    if (!updatedAudio) {
      return res.status(404).json({ message: 'Audio không tồn tại!' });
    }
    res.json(updatedAudio); // Trả về audio đã cập nhậ
  } catch (error) {
    res.status(500).send('Error updating view count');
  }
});
// ----------Playlists--------------
// Schemma for creating Playlist
const Playlist = mongoose.model("playlist", {
  id: {
    type: String
  },
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'all'
  },
  image: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now()
  },
  songIds: {
    type: Array,
    // default: []
  }
});
// Creating API for adding Playlists
app.post('/addplaylist', async (req, res) => {
  try {
    // Lấy tất cả playlists hiện có
    let playlists = await Playlist.find({});
    let idNumber = '001';

    // Tạo ID mới dựa trên playlist cuối cùng nếu có
    if (playlists.length > 0) {
      let lastPlaylistId = playlists[playlists.length - 1].id;
      idNumber = (parseInt(lastPlaylistId.slice(2)) + 1).toString().padStart(3, '0');
    }

    // Tạo ID playlist
    const id = req.body.id || `PL${idNumber}`; 
    const imageUrl = req.body.image || `http://localhost:5000/images/${id}.jpg`;
    // Tạo mới playlist với các thuộc tính
    const playlist = new Playlist({
      id: id,
      name: req.body.name,
      username: req.body.username,
      songIds: req.body.songIds,
      type: req.body.type?req.body.type:'all',
      image: imageUrl,
      date:new Date(), // Mặc định là ngày hiện tại nếu không có `date`
    });
    

    await playlist.save(); // Lưu playlist mới vào database
    console.log("Playlist đã lưu:", playlist);

    res.status(201).json({
      success: 1,
      id: playlist.id // Trả về id đã được tạo mới
    });
  } catch (error) {
    console.error('Error adding playlist:', error);
    res.status(500).json({ message: 'Error adding playlist' });
  }
});

// Creating API for deleting playlist
// API for deleting a playlist
// app.delete('/api/playlist/:id', async (req, res) => {
//   const audioId = req.params.id;
//   try {
//     // Xóa audio theo ID
//     const deletedAudio = await Playlist.findOneAndDelete({ id: audioId });

//     if (!deletedAudio) {
//       return res.status(404).json({ message: 'Audio not found' });
//     }
//     res.status(200).json({ message: 'Audio deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting audio:', error);
//     res.status(500).json({ message: 'Error deleting audio' });
//   }
// });
// API for deleting a playlist
app.delete('/api/playlist/:id', async (req, res) => {
  const audioId = req.params.id;
  try {
    // Xóa playlist theo ID
    const deletedPlaylist = await Playlist.findOneAndDelete({ id: audioId });

    if (!deletedPlaylist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    // Tìm tất cả các PLcollection có chứa playlistId là audioId
    const collections = await PLcollectionModel.find({ playlistIds: audioId });

    // Xóa audioId khỏi playlistIds của mỗi PLcollection tìm thấy
    await Promise.all(collections.map(async (collection) => {
      collection.playlistIds = collection.playlistIds.filter(id => id !== audioId);
      await collection.save();
    }));

    res.status(200).json({ message: 'Playlist and references in PLcollection deleted successfully' });
  } catch (error) {
    console.error('Error deleting playlist:', error);
    res.status(500).json({ message: 'Error deleting playlist' });
  }
});

// Creating API for getting all playlists
app.get('/allplaylists', async (req, res) => {
    try {
      const playlists = await Playlist.find({}); // Fetch all products from MongoDB
      res.status(200).json(playlists); // Send products in JSON format
    } catch (error) {
      res.status(500).json({ message: 'Error fetching products', error });
    }
});
// Route để lấy playlist dựa trên playlistId
app.get('/playlists/:id', async (req, res) => {
  const { id } = req.params; // Lấy playlistId từ URL
  try {
    const playlist = await Playlist.findOne({ id: id }); // Tìm playlist trực tiếp theo id
    if (playlist) {
      res.json(playlist); // Trả về playlist nếu tìm thấy
    } else {
      res.status(404).json({ message: 'Playlist không tồn tại' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Có lỗi xảy ra khi lấy playlist' });
  }
});
 
app.get('/allplaylists/songs',async (req, res) => {
  try {
    const songsPlaylists = await Playlist.find({type:'music'}); // Fetch all products from MongoDB
    res.status(200).json(songsPlaylists); // Send products in JSON format
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
});
app.get('/allplaylists/podcasts',async (req, res) => {
  try {
    const songsPlaylists = await Playlist.find({type:'podcast'}); // Fetch all products from MongoDB
    res.status(200).json(songsPlaylists); // Send products in JSON format
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
});
app.get('/songs',async (req, res) => {
  try {
    const audios = await Audio.find({}); // Fetch all products from MongoDB
    const songs = audios.filter(audio => audio.id.startsWith('M'));  // Lọc các bài hát
    res.status(200).json(songs); // Send products in JSON format
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
});
  
// Route để lấy tất cả các podcast (id bắt đầu bằng 'P')
app.get('/podcasts',async (req, res) => {
  try {
    const audios = await Audio.find({}); // Fetch all products from MongoDB
    const songs = audios.filter(audio => audio.id.startsWith('P'));  // Lọc các bài hát
    res.status(200).json(songs); // Send products in JSON format
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
});

// Route để lấy bài hát dựa trên songId
app.get('/audios/:audioId', async (req, res) => {
  try {
    const {audioId} = req.params; // Lấy audioId từ URL
    console.log(audioId)
    const audios = await Audio.find({});
    const audio = audios.find(audio => audio.id === audioId);
    if (audio) { 
      res.json(audio); // Trả về bài hát nếu tìm thấy
    } else { 
      res.status(404).json({ message: 'Bài hát không tồn tại' });
    } 
  } 
  catch (error) { 
    res.status(500).json({ message: 'Error fetching products', error });
  } 
  
});

// ----------PLcollection--------------
// Schemma for creating PLcollection
const PLcollectionModel  = mongoose.model("PLcollection", {
  id: {
    type: String
  },
  name: {
    type: String,
  },
  username: {
    type: String,
    default: 'B2113345'
  },
  type: {
    type: String,
    default: 'all'
  },
  date: {
    type: Date,
    default: Date.now()
  },
  playlistIds: {
    type: Array,
    default: []
    // required: true
  }
});

// Route để lấy bài hát dựa trên PLCollectionId hoặc PLCollectionUsername
app.get('/plcollection/:plcollectionId', async (req, res) => {
  const { plcollectionId } = req.params; // Sử dụng tên biến đúng
  try {
    // Tìm PLCollection theo ID hoặc username
    const plc = await PLcollectionModel.findOne({
      $or: [{ id: plcollectionId }, { username: plcollectionId }]
    });

    if (plc) {
      res.json(plc);
    } else {
      res.status(404).json({ message: 'PLCollection không tồn tại' });
    }
  } catch (error) {
    console.error('Error fetching PLCollection:', error);
    res.status(500).json({ message: 'Lỗi khi tìm PLCollection' });
  }
});

// Creating API for adding PLcollection
app.post ('/addPLcollection',async (req,res)=>{
  let PLC = await PLcollectionModel .find({})
  if (PLC.length>0){
    let lastPLC = PLC.slice(-1)[0];
    let lastPLCId = lastPLC.id;
    var idNumber = (parseInt(lastPLCId.slice(2)) + 1).toString()
    console.log(idNumber)
    while(idNumber.length < 3){
      idNumber = '0' + idNumber
    }
  }
  else {idNumber='001'}
  let id = 'PC'+ idNumber;
  id = req.body.id ? req.body.id : id
  const pLcollection = new PLcollectionModel ({
    id: id, 
    name: req.body.name,
    username: req.body.username?req.body.username:'B2113345',
    playlistIds: req.body.playlistIds,
    date: req.body.date,
    type: req.body.type
  })
  await pLcollection.save();
  console.log("Saved")
  res.json({
    success: 1,
    name: req.body.name,
  })
})
// Creating API for deleting plcollection
// app.delete('/api/plcollection/:id', async (req, res) => {
//   const audioId = req.params.id;
//   try {

//     // Xóa audio theo ID
//     const deletedAudio = await PLcollectionModel.findOneAndDelete({ id: audioId });

//     if (!deletedAudio) {
//       return res.status(404).json({ message: 'Audio not found' });
//     }
//     res.status(200).json({ message: 'Audio deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting audio:', error);
//     res.status(500).json({ message: 'Error deleting audio' });
//   }
// });
app.delete('/api/plcollection/:id', async (req, res) => {
  const plCollectionId = req.params.id;
  const { username } = req.body; // Lấy username từ request body

  try {
    // Tìm user theo username để kiểm tra quyền
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User không tồn tại' });
    }
    const isAdmin = user.isAdmin;
    // Tìm Playlist Collection theo ID
    const plCollection = await PLcollectionModel.findOne({ id: plCollectionId });
    if (!plCollection) {
      return res.status(404).json({ message: 'Playlist Collection không tồn tại' });
    }

    if (isAdmin) {
      // Nếu user là admin, chỉ xóa Playlist Collection
      await PLcollectionModel.findOneAndDelete({ id: plCollectionId });
      return res.status(200).json({ message: 'Playlist Collection đã được xóa, các playlists vẫn giữ nguyên' });
    } else {
      // Nếu không phải admin, xóa Playlist Collection và tất cả playlists bên trong
      const playlistIds = plCollection.playlistIds; // Danh sách ID các playlists
      await Playlist.deleteMany({ id: { $in: playlistIds } }); // Xóa các playlists
      await PLcollectionModel.findOneAndDelete({ id: plCollectionId }); // Xóa Playlist Collection
      return res.status(200).json({ message: 'Playlist Collection và các playlists đã được xóa' });
    }
  } catch (error) {
    console.error('Error deleting playlist collection:', error);
    res.status(500).json({ message: 'Lỗi khi xóa Playlist Collection' });
  }
});

// Creating API for getting all PLcollection
app.get('/allplcollection', async (req, res) => {
    try {
      const plc = await PLcollectionModel.find({}); // Fetch all products from MongoDB
      res.status(200).json(plc); // Send products in JSON format
    } catch (error) {
      res.status(500).json({ message: 'Error fetching products', error });
    }
});
app.get('/allplcollection/songs',async (req, res) => {
  try {
    const songsPlaylists = await PLcollectionModel.find({type:'music'}); // Fetch all products from MongoDB
    res.status(200).json(songsPlaylists); // Send products in JSON format
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
});
app.get('/allplcollection/podcasts',async (req, res) => {
  try {
    const songsPlaylists = await PLcollectionModel.find({type:'podcast'}); // Fetch all products from MongoDB
    res.status(200).json(songsPlaylists); // Send products in JSON format
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
});
// ----------User--------------
// Schemma for creating User
const User = mongoose.model("user", {
  id: {
    type: String,
    required: true,
    unique: true 
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  date: {
    type: Date,
    default: Date.now()
  },
  password: {
    type: String,
    required: true
  },
  isAdmin :{
    type: Boolean,
    default: false
  }, 
  isSuperAdmin: {
    type: Boolean,
    default: false
  },
  duration:{
    type: String,
    required: false
  }
});
// Creating API for adding user
app.post ('/adduser',async (req,res)=>{
  const { email, username,isAdmin, password,isSuperAdmin} = req.body;
  const existingUser = await User.findOne({email});

  if (existingUser) {
    return res.status(500).json({ message: 'User with this email already exists' });
  }
  //  Lấy tất cả playlists hiện có
  let users = await User.find({})
  let idNumber = '0001'
  // Tạo ID mới dựa trên playlist cuối cùng nếu có
  if (users.length > 0) {
    let lastUserId = users[users.length - 1].id;
    if (lastUserId)
      idNumber = (parseInt(lastUserId.slice(1)) + 1).toString().padStart(4, '0');
  }
  // Tạo ID playlist 
  const id = `U${idNumber}`;
  // Mã hóa mật khẩu
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User ({
    id: id,
    email: email,
    username: username,
    isAdmin : isAdmin || false,
    isSuperAdmin : isSuperAdmin || false,
    password: hashedPassword,
  })
  await user.save();
  console.log("Saved")
  res.json({
    success: 1,
    user,
  })
})
// Creating API for deleting user
app.delete('/api/user/:id', async (req, res) => {
  const audioId = req.params.id;
  try {
    // Xóa audio theo ID
    const deletedAudio = await User.findOneAndDelete({ id: audioId });

    if (!deletedAudio) {
      return res.status(404).json({ message: 'Audio not found' });
    }
    res.status(200).json({ message: 'Audio deleted successfully' });
  } catch (error) {
    console.error('Error deleting audio:', error);
    res.status(500).json({ message: 'Error deleting audio' });
  }
});

// Route để lấy user dựa trên username/email
app.get('/users/:param', async (req, res) => {
  const { param } = req.params;
  try {
    // Tìm user dựa trên username hoặc email
    const user = await User.findOne({
      $or: [
        { username: param }, 
        { email: param }
      ]
    });
    
    if (user) {
      res.json(user); // Trả về user nếu tìm thấy
    } else {
      res.status(404).json({ message: 'Username hoặc email không tồn tại' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});
// Creating API for getting all allusers
app.get('/allusers', async (req, res) => {
  try {
    const users = await User.find({}); // Fetch all products from MongoDB
    res.status(200).json(users); // Send products in JSON format
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  } 
});
app.get('/users', async (req, res) => {
  const isAdmin = req.query.isAdmin === 'true'; // Chuyển giá trị 'isAdmin' thành boolean
  try {
      const users = await User.find({ isAdmin: isAdmin });
      res.status(200).json(users);
  } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Error fetching users' });
  }
});

// Route đăng nhập
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
      // Tìm user trong cơ sở dữ liệu
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(400).json({ message: 'User not found' });
      }
      
      // Kiểm tra mật khẩu
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
          return res.status(400).json({ message: 'Incorrect password or email' });
      }
      // Tạo JWT token nếu đăng nhập thành công
      const token = jwt.sign({ userId: user._id }, 'your_secret_key', { expiresIn: '1h' });

      // Gửi token và user về client
      res.cookie('token', token, { 
          httpOnly: true,    // Bảo mật, cookie không thể truy cập từ JavaScript
          secure: false,     // Đặt true nếu dùng HTTPS
          sameSite: 'lax',   // Ngăn chặn CSRF cơ bản
      });

      res.status(200).json({ 
          message: 'Login successful', 
          user
      });

  } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

// Route cập nhật audio (upload.single cho file đơn)
app.put('/audio/:id', async (req, res) => {
  const { id } = req.params; // Đây là id kiểu chuỗi như P0013
  const {name,singer,type,image,file} = req.body;
  try {
    // Tìm theo trường id tùy chỉnh
    const updateData = {name,singer,type,image,file};
    // console.log(updateData)
    const updatedAudio = await Audio.findOneAndUpdate({id: id }, updateData, {new: true});
    console.log('updatedAudio',updatedAudio)
    if (!updatedAudio) {
      return res.status(404).json({ message: 'Audio không tồn tại!' });
    }
    res.json(updatedAudio); // Trả về audio đã cập nhật
  } catch (error) {
    console.error('Error updating audio:', error);
    res.status(500).json({ message: 'Lỗi khi cập nhật audio', error });
  }
});

// API tìm kiếm audio
app.get('/audio/search', async (req, res) => {
  const { query } = req.query;  // Lấy từ khóa từ request
  try {
    const results = await Audio.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },  // Tìm theo tên (không phân biệt hoa thường)
        { singer: { $regex: query, $options: 'i' } }, // Tìm theo nghệ sĩ
        { id: { $regex: query, $options: 'i' } }
      ]
    });
    res.status(200).json(results);
  } catch (error) {
    res.status(500).send('Error searching for audios');
  }
});

// API tìm kiếm playlist
app.get('/playlist/search', async (req, res) => {
  const { query } = req.query;  // Lấy từ khóa từ request
  
  try {
    const results = await Playlist.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },  // Tìm theo tên (không phân biệt hoa thường)
        { id: { $regex: query, $options: 'i' } },
        { username: { $regex: query, $options: 'i' } },
        { type: { $regex: query, $options: 'i' } },
      ]
    });
  
    res.status(200).json(results);
  } catch (error) {
    res.status(500).send('Error searching for audios');
  }
});
// Route cập nhật playlist (upload.single cho file đơn)
app.put('/playlist/:id', async (req, res) => {
  const { id } = req.params; // Đây là id kiểu chuỗi như P0013
  const {name,username,type,image,songIds} = req.body;

  try {
    // Tìm theo trường id tùy chỉnh
    const updateData = {name,username,type,image,songIds};
    // console.log(updateData)
    const updatedPlaylist = await Playlist.findOneAndUpdate({id: id }, updateData, {new: true});
    console.log('updatedPlaylist',updatedPlaylist)
    if (!updatedPlaylist) {
      return res.status(404).json({ message: 'Audio không tồn tại!' });
    }
    res.json(updatedPlaylist); // Trả về Playlist đã cập nhật
  } catch (error) {
    console.error('Error updating audio:', error);
    res.status(500).json({ message: 'Lỗi khi cập nhật audio', error });
  }
});

// API tìm kiếm playlist
app.get('/plcollection/search', async (req, res) => {
  const { query } = req.query;  // Lấy từ khóa từ request
  try {
    const results = await PLcollectionModel.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },  // Tìm theo tên (không phân biệt hoa thường)
        { id: { $regex: query, $options: 'i' } },
        { username: { $regex: query, $options: 'i' } },
        { type: { $regex: query, $options: 'i' } },
      ]
    });
  
    res.status(200).json(results);
  } catch (error) {
    res.status(500).send('Error searching for audios');
  }
});

// Route cập nhật plcollection (upload.single cho file đơn)
app.put('/plcollection/:id', async (req, res) => {
  const { id } = req.params; // Đây là id kiểu chuỗi như P0013
  const {name,username,type,playlistIds} = req.body;

  try {
    // Tìm theo trường id tùy chỉnh
    const updateData = {name,username,type,playlistIds};
    // console.log(updateData)
    const updatedPlaylist = await PLcollectionModel.findOneAndUpdate({id: id }, updateData, {new: true});
    // console.log('updatedPlaylist',updatedPlaylist)
    if (!updatedPlaylist) {
      return res.status(404).json({ message: 'Audio không tồn tại!' });
    }
    res.json(updatedPlaylist); // Trả về Playlist đã cập nhật
  } catch (error) {
    console.error('Error updating audio:', error);
    res.status(500).json({ message: 'Lỗi khi cập nhật audio', error });
  }
});
app.get("/export", async (req, res) => {
  const { type, sort } = req.query;
  let data;
  try {
    if (type === 'audio') {
      if (sort === 'music') {
        let audios = await Audio.find({}, { _id: 0, __v: 0});
        data = audios.filter(audio => audio.id.startsWith('M'));
      } else if (sort === 'podcast')  {
        let audios = await Audio.find({}, { _id: 0, __v: 0});
        data = audios.filter(audio => audio.id.startsWith('P'));
      }
      else {
        data = await Audio.find({}, { _id: 0, __v: 0});
      }
    }
    else if (type === 'playlist') {
      if (sort =='all'){
        data = await Playlist.find({}, { _id: 0, __v: 0});
      }
      else
        data = await Playlist.find({type:sort}, { _id: 0, __v: 0});
    }
    else{
      if (sort =='all'){
        data = await PLcollectionModel.find({}, { _id: 0, __v: 0});
      }
      else
        data = await PLcollectionModel.find({type:sort}, { _id: 0, __v: 0});
    }

    // Chuyển đổi dữ liệu trước khi tạo Sheet
    const processedData = data.map(item => {
      const obj = item.toObject(); // Chuyển mỗi item thành object đơn giản
      // Chuyển trường `singer` (hoặc các mảng khác) thành chuỗi
      if (Array.isArray(obj.singer)) {
        obj.singer = obj.singer.join(", "); // Chuyển mảng thành chuỗi, mỗi phần tử cách nhau bằng dấu phẩy
      }
      if (Array.isArray(obj.songIds)) {
        obj.songIds = obj.songIds.join(", "); // Chuyển mảng thành chuỗi, mỗi phần tử cách nhau bằng dấu phẩy
      }
      return obj;
    });

    // Tạo một Workbook mới
    const workbook = XLSX.utils.book_new();

    // Tạo một Sheet từ dữ liệu đã xử lý
    const worksheet = XLSX.utils.json_to_sheet(processedData);

    // Thêm Sheet vào Workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Songs & Podcasts");

    // Đặt tên cho file và đường dẫn lưu tạm thời
    const filePath = path.join(__dirname, "exported_data.xlsx");

    // Ghi dữ liệu vào file Excel
    XLSX.writeFile(workbook, filePath);

    // Gửi file Excel về cho client
    res.download(filePath, "songs_podcasts.xlsx", (err) => {
      if (err) {
        console.error("Error downloading file:", err);
        res.status(500).send("Error exporting data");
      }

      // Xóa file sau khi gửi thành công
      fs.unlinkSync(filePath);
    });
  } catch (error) {
    console.error("Error exporting data:", error);
    res.status(500).send("Error exporting data");
  }
});






