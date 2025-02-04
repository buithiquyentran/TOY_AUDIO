const User = require("../models/User")
// Creating API for adding user
exports.AddUser = async (req,res)=>{
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
}
// Creating API for deleting user
exports.deleteUser =  async (req, res) => {
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
}
// Route để lấy user dựa trên username/email
exports.GetUser = async (req, res) => {
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
}
// Creating API for getting all allusers
exports.GetAllusers =  async (req, res) => {
  try {
    const users = await User.find({}); // Fetch all products from MongoDB
    res.status(200).json(users); // Send products in JSON format
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  } 
}
exports.GetUsersWithRole =  async (req, res) => {
  const isAdmin = req.query.isAdmin === 'true'; // Chuyển giá trị 'isAdmin' thành boolean
  try {
      const users = await User.find({ isAdmin: isAdmin });
      res.status(200).json(users);
  } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Error fetching users' });
  }
}
