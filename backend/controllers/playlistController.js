const Playlist = require("../models/Playlist")
exports.GetLastplaylistId= async (req, res) => {
  let audios = await Playlist.find({});
  if (audios.length > 0) {
      let lastAudio = audios.slice(-1)[0];
      res.json({ id: lastAudio.id });
  } else {
      res.json({ id: null });
  }
}
exports.AddPlaylist= async (req, res) => {
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
}
// API for deleting a playlist
exports.DeletePlaylist =  async (req, res) => {
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
}
// Creating API for getting all playlists
exports.GetAllPlaylists= async (req, res) => {
    try {
      const playlists = await Playlist.find({}); // Fetch all products from MongoDB
      res.status(200).json(playlists); // Send products in JSON format
    } catch (error) {
      res.status(500).json({ message: 'Error fetching products', error });
    }
}
// Route để lấy playlist dựa trên playlistId
exports.GetPlaylists = async (req, res) => {
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
}
exports.GetAllPlaylistSongs = async (req, res) => {
  try {
    const songsPlaylists = await Playlist.find({type:'music'}); // Fetch all products from MongoDB
    res.status(200).json(songsPlaylists); // Send products in JSON format
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
}
exports.GetAllPlaylistPodcasts = async (req, res) => {
  try {
    const songsPlaylists = await Playlist.find({type:'podcast'}); // Fetch all products from MongoDB
    res.status(200).json(songsPlaylists); // Send products in JSON format
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
}
// API tìm kiếm playlist
exports.SearchPlaylist = async (req, res) => {
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
}
// Route cập nhật playlist (upload.single cho file đơn)
exports.UpdatePlaylist = async (req, res) => {
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
}