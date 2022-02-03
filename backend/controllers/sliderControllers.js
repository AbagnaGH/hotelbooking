import cloudinary from 'cloudinary';
import catchAsyncErrors from '../middlewares/catchAsyncErrors';
import Slider from '../models/sliderModel';
import ErrorHandler from '../utils/errorHandler';

// Create new slider   =>   /api/slider
export const createNewSlider = catchAsyncErrors(async (req, res) => {
  const images = req.body.images;
  let imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: 'bookit/sliders',
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;
  req.body.user = req.user._id;

  const slider = await Slider.create(req.body);

  res.status(200).json({
    success: true,
    slider,
  });
});

// Update slider details   =>   /api/sliders/:id
export const updateSlider = catchAsyncErrors(async (req, res, next) => {
  let slider = await Slider.findById(req.query.id);

  if (!slider) {
    return next(new ErrorHandler('Slider not found with this ID', 404));
  }

  if (req.body.images) {
    // Delete images associated with the slider
    for (let i = 0; i < slider.images.length; i++) {
      await cloudinary.v2.uploader.destroy(slider.images[i].public_id);
    }

    let imagesLinks = [];
    const images = req.body.images;

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: 'bookit/sliders',
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }

  slider = await Slider.findByIdAndUpdate(req.query.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    slider,
  });
});

// Get slider details   =>   /api/sliders/:id
export const getSingleSlider = catchAsyncErrors(async (req, res, next) => {
  const slider = await Slider.findById(req.query.id);

  if (!slider) {
    return next(new ErrorHandler('Slider not found with this ID', 404));
  }

  res.status(200).json({
    success: true,
    slider,
  });
});

// Admin Routes
export const getAllAdminSliders = catchAsyncErrors(async (req, res) => {
  const sliders = await Slider.find();
  res.status(200).json({
    success: true,
    sliders,
  });
});
