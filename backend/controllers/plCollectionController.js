const PLcollectionModel = require("../models/PLcollection")
// Route để lấy bài hát dựa trên PLCollectionId hoặc PLCollectionUsername
exports.GetPlcollection=  async (req, res) => {
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
}
// Creating API for adding PLcollection
exports.AddPLcollection = async (req,res)=>{
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
}
exports.DeletePlcollection = async (req, res) => {
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
}
// Creating API for getting all PLcollection
exports.GetAllplcollection =  async (req, res) => {
    try {
    const plc = await PLcollectionModel.find({}); // Fetch all products from MongoDB
    res.status(200).json(plc); // Send products in JSON format
    } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
    }
}
exports.getAllplcollectionSongs = async (req, res) => {
try {
    const songsPlaylists = await PLcollectionModel.find({type:'music'}); // Fetch all products from MongoDB
    res.status(200).json(songsPlaylists); // Send products in JSON format
} catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
}
}
exports.getAllplcollectionPodcasts =  async (req, res) => {
    try {
        const songsPlaylists = await PLcollectionModel.find({type:'podcast'}); // Fetch all products from MongoDB
        res.status(200).json(songsPlaylists); // Send products in JSON format
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error });
    }
}
exports.SearchPlcollection = async (req, res) => {
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
}
  
// Route cập nhật plcollection (upload.single cho file đơn)
exports.UpdatePlcollection = async (req, res) => {
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
}
  
