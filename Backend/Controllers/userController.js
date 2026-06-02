const User = require('../Models/User');

exports.getAllUsers = async (req, res) => {
    try {
        // Create a dynamic query filter object
        const queryFilter = {};
        
        // If a role query is provided in the URL (e.g., ?role=employee), add it to the filter
        if (req.query.role) {
            queryFilter.role = req.query.role;
        }

        // Apply the filter to our Mongoose lookup
        const users = await User.find(queryFilter).select('-password').sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: users.length,
            users: users // Changed key from 'data' to 'users' to match your frontend destructuring
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.createUser = async (req, res) => {
    try {
        // Utilizing your static .signup method which handles validation & hashing
        const newUser = await User.signup(req.body);
        
        // Remove password from the response object for security
        const userResponse = newUser.toObject();
        delete userResponse.password;

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: userResponse
        });
    } catch (error) {
        // Catching errors thrown by userSchema.statics.signup (e.g., 'Email already in use')
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(400).json({ success: false, error: 'Invalid ID format or server error' });
    }
};

exports.getMyProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user._id)
      .select('-password');

    res.status(200).json({
      success: true,
      data: user
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message
    });

  }
};

exports.updateProfile = async (req, res) => {
  try {

    console.log(req.body);
    console.log(req.file);

    const updates = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone
    };

    if (req.file) {
      updates.photo = req.file.filename;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      data: user
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });
  }
};

exports.updateUser = async (req, res) => {
    try {
        // Prevent password updates through this route (password updates should have a separate secure route)
        if (req.body.password) {
            return res.status(400).json({ 
                success: false, 
                error: 'Password updates are not allowed on this route. Use a dedicated password reset feature.' 
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true } // 'new' returns the updated doc, 'runValidators' ensures enum/schema checks pass
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.deleteuser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        res.status(200).json({ 
            success: true, 
            message: `${user.name} (${user.role}) has been successfully deleted.` 
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};