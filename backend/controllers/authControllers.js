import shortId from 'shortid';
import cloudinary from 'cloudinary';
import User from '../models/userModel';
import catchAsyncErrors from '../middlewares/catchAsyncErrors';
import ErrorHandler from '../utils/errorHandler';
import sendEmail from '../utils/sendEmail';
import absoluteUrl from 'next-absolute-url';
import crypto from 'crypto';
// setting up cloudinary config

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Register user=>/api/auth/register
export const registerUser = catchAsyncErrors(async (req, res) => {
  // const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
  //   folder: 'bookit/avatars',
  //   width: '150',
  //   crop: 'scale',
  // });
  let username = shortId.generate();
  const { name, email, password, avatar } = req.body;

  // let userExist = await User.findOne({ email: req.body.email }).exec();
  // if (userExist) return next(new ErrorHandler('Email is take', 404));

  const user = await new User({
    username,
    name,
    email,
    password,
    avatar,
    // avatar: {
    //   public_id: result.public_id,
    //   url: result.url,
    // },
  }).save();
  res.send(user);
});

// Current user profile =>/api/profile
export const currentUserProfile = catchAsyncErrors(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.send(user);
});


// Update user profile =>/api/profile/update

export const updateUserProfile = catchAsyncErrors(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name;
    user.email = req.body.email;

    if (req.body.password) user.password = req.body.password;
  }

  // Update avatar
  if (req.body.avatar !== '') {
    const image_id = user.avatar.public_id;

    // Delete user previous image/avatar
    await cloudinary.v2.uploader.destroy(image_id);

    const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: 'bookit/avatars',
      width: '150',
      crop: 'scale',
    });

    user.avatar = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  }

  await user.save();

  res.status(200).json({
    success: true,
  });
});

// Forgot password   =>   /api/password/forgot
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler('User not found with this email', 404));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Get origin
  const { origin } = absoluteUrl(req);

  // Create reset password url
  const resetUrl = `${origin}/password/reset/${resetToken}`;

  const message = `Your password reset url is as follow: \n\n ${resetUrl} \n\n\ If you have not requested this email, then ignore it.`;
  // const html = `<h1>Will you be my best friend</h1>`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'BookIT Password Recovery',
      message,
      // html,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to: ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

// Reset password   =>   /api/password/reset/:token
export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  // Hash URL token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.query.token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        'Password reset token is invalid or has been expired',
        400,
      ),
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler('Password does not match', 400));
  }

  // Setup the new password
  user.password = req.body.password;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password updated successfully',
  });
});

// Get all users by admin  =>/api/admin/users
export const getAllUsersByAdmin = catchAsyncErrors(async (req, res) => {
  const users = await User.find({ role: 'admin' }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    users,
  });
});

// Get all customers by admin  =>/api/admin/customers
export const getAllCustomersByAdmin = catchAsyncErrors(async (req, res) => {
  const customers = await User.find({ role: 'customer' }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    customers,
  });
});

// Get user details  =>   /api/admin/users/:id
export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.query.id);

  if (!user) {
    return next(new ErrorHandler('User not found with this ID.', 400));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// Get customer details  =>   /api/admin/custormer/:id
export const getCustomerDetails = catchAsyncErrors(async (req, res, next) => {
  const customer = await User.findById(req.query.id);

  if (!customer) {
    return next(new ErrorHandler('User not found with this ID.', 400));
  }

  res.status(200).json({
    success: true,
    customer,
  });
});

// Update user details  =>   /api/admin/users/:id
export const updateUser = catchAsyncErrors(async (req, res) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.query.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// Update customer details  =>   /api/admin/customers/:id
export const updateCustomer = catchAsyncErrors(async (req, res) => {
  const newCustomerData = {
    role: req.body.role,
  };

  const customer = await User.findByIdAndUpdate(req.query.id, newCustomerData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// Delete user    =>   /api/admin/users/:id
export const deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.query.id);

  if (!user) {
    return next(new ErrorHandler('User not found with this ID.', 400));
  }

  // Remove avatar
  const image_id = user.avatar.public_id;
  await cloudinary.v2.uploader.destroy(image_id);

  await user.remove();

  res.status(200).json({
    success: true,
    user,
  });
});
