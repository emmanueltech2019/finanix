


// Register a new user
module.exports.registerAdmin = async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      // Check if the email is already registered
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }
  
      // Hash the password before saving to the database
      const UserId =  generateSixDigitCode()
  
      // Create a new user object
      const newUser = new User({
        name,
        email,
        password,
        UserId
      });
  
      // Save the new user to the database
      await newUser.save();
  
      return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Error during user registration:', error);
      // Check if the error is a Mongoose ValidationError
      if (error instanceof mongoose.Error.ValidationError) {
        // Extract the validation error messages
        const validationErrors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({ errors: validationErrors });
      }
  
      console.error('Error during user registration:', error);
      return res.status(500).json({ message: 'Internal server error' });
      
    }
  };
  
  
  
  // Login user
  module.exports.loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if the user with the provided email exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Check if the provided password matches the stored hashed password
      // const isPasswordValid = password, user.password
      if (password!==user.password) {
        return res.status(401).json({ message: 'Invalid password' });
      }
  
      // If the password is valid, create a JSON Web Token (JWT) to authenticate the user
      const token = jwt.sign({ userId: user._id }, process.env.APP_SECRET);
  
      // You can set the token as an HTTP-only cookie to enhance security
      // res.cookie('token', token, { httpOnly: true });
  
      return res.status(200).json({ token, message: 'Login successful' });
    } catch (error) {
      console.error('Error during user login:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };