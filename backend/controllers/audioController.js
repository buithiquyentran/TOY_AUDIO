const Audio = require("../models/Audio");
const path = require("path");

exports.GetLastAudioId = async (req, res) => {
  let audios = await Audio.find({});
  if (audios.length > 0) {
      let lastAudio = audios.slice(-1)[0];
      res.json({ id: lastAudio.id });
  } else {
      res.json({ id: null });
  }
};

exports.Addaudio= async (req, res) => {
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
}

exports.DeleteAudio = async (req, res) => {
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
      console.error('Error deleting audio:= error');
      res.status(500).json({ message: 'Error deleting audio' });
    }
  }
  
//Creating API for getting all products
exports.GetAllAudios = async (req, res) => {
    try {
      const audios = await Audio.find({}); // Fetch all products from MongoDB
      res.status(200).json(audios); // Send products in JSON format
    } catch (error) {
      res.status(500).json({ message: 'Error fetching products', error });
    }
}
// API để tăng số lượt nghe
exports.UpdateView = async (req, res) => {
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
}
exports.GetSongs = async (req, res) => {
  try {
    const audios = await Audio.find({}); // Fetch all products from MongoDB
    const songs = audios.filter(audio => audio.id.startsWith('M'));  // Lọc các bài hát
    res.status(200).json(songs); // Send products in JSON format
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
}
// Route để lấy tất cả các podcast (id bắt đầu bằng 'P')
exports.GetPodcasts = async (req, res) => {
  try {
    const audios = await Audio.find({}); // Fetch all products from MongoDB
    const songs = audios.filter(audio => audio.id.startsWith('P'));  // Lọc các bài hát
    res.status(200).json(songs); // Send products in JSON format
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
} 
// Route để lấy bài hát dựa trên songId
exports.GetAudio =  async (req, res) => {
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
  
}

// Route cập nhật audio (upload.single cho file đơn)
exports.UpdateAudio = async (req, res) => {
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
}
// API tìm kiếm audio
exports.SearchAudio= async (req, res) => {
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
}
