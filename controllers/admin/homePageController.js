const HomePage = require('../../models/homePageModel');
const { uploadToS3 } = require('../../helpers/awsUpload');

// Upload a new banner
exports.addBanner = async (req, res) => {
  const { name, text, buttonText, buttonLink } = req.body;
  
  try {
    let imageUrl = null;
    let backgroundImageUrl = null;

    if (req.files && req.files.image) {
      imageUrl = await uploadToS3(req.files.image[0], 'banners');
    }
    if (req.files && req.files.backgroundImage) {
      backgroundImageUrl = await uploadToS3(req.files.backgroundImage[0], 'banners/backgrounds');
    }

    let homePage = await HomePage.findOne();
    if (!homePage) {
      homePage = new HomePage();
    }

    homePage.banners.push({ name, text, image: imageUrl, backgroundImage: backgroundImageUrl, buttonText, buttonLink });
    await homePage.save();

    res.status(201).json({ message: 'Banner added successfully', banners: homePage.banners });
  } catch (error) {
    res.status(500).json({ message: 'Error adding banner', error: error.message });
  }
};

// Edit an existing banner
exports.editBanner = async (req, res) => {
  const { bannerId, name, text, buttonText, buttonLink, isActive } = req.body;

  try {
    const homePage = await HomePage.findOne();
    if (!homePage) {
      return res.status(404).json({ message: 'Home page not found' });
    }

    const banner = homePage.banners.id(bannerId);
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }

    if (name !== undefined) banner.name = name;
    if (text !== undefined) banner.text = text;
    if (buttonText !== undefined) banner.buttonText = buttonText;
    if (buttonLink !== undefined) banner.buttonLink = buttonLink;
    if (isActive !== undefined) banner.isActive = isActive;

    // Upload new images if provided
    if (req.files && req.files.image) {
      banner.image = await uploadToS3(req.files.image[0], 'banners');
    }
    if (req.files && req.files.backgroundImage) {
      banner.backgroundImage = await uploadToS3(req.files.backgroundImage[0], 'banners/backgrounds');
    }

    await homePage.save();
    res.status(200).json({ message: 'Banner updated successfully', banners: homePage.banners });
  } catch (error) {
    res.status(500).json({ message: 'Error updating banner', error: error.message });
  }
};

// Remove a banner
exports.removeBanner = async (req, res) => {
  const { bannerId } = req.params;

  try {
    const homePage = await HomePage.findOne();

    if (!homePage) {
      return res.status(404).json({ message: 'Home page not found' });
    }

    homePage.banners = homePage.banners.filter(banner => banner._id.toString() !== bannerId);
    await homePage.save();

    res.status(200).json({ message: 'Banner removed successfully', banners: homePage.banners });
  } catch (error) {
    res.status(500).json({ message: 'Error removing banner', error: error.message });
  }
};

// Get all active banners
exports.getActiveBanners = async (req, res) => {
  try {
    const homePage = await HomePage.findOne();

    if (!homePage || homePage.banners.length === 0) {
      return res.status(404).json({ message: 'No banners found' });
    }

    const activeBanners = homePage.banners.filter(banner => banner.isActive);

    res.status(200).json({ message: 'Active banners fetched successfully', banners: activeBanners });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching active banners', error: error.message });
  }
};

// Get all banners
exports.getAllBanners = async (req, res) => {
  try {
    const homePage = await HomePage.findOne();

    if (!homePage || homePage.banners.length === 0) {
      return res.status(404).json({ message: 'No banners found' });
    }

    res.status(200).json({ message: 'All banners fetched successfully', banners: homePage.banners });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching banners', error: error.message });
  }
};




// Add a top category
exports.addTopCategory = async (req, res) => {
  const { name, categoryId } = req.body;

  try {
    let homePage = await HomePage.findOne();

    if (!homePage) {
      homePage = new HomePage();
    }

    homePage.topCategories.push({ name, categoryId });
    await homePage.save();

    res.status(201).json({ message: 'Top category added successfully', topCategories: homePage.topCategories });
  } catch (error) {
    res.status(500).json({ message: 'Error adding top category', error: error.message });
  }
};

// Edit a top category
exports.editTopCategory = async (req, res) => {
  const { categoryId, name, isActive } = req.body;

  try {
    const homePage = await HomePage.findOne();

    if (!homePage) {
      return res.status(404).json({ message: 'Home page not found' });
    }

    const category = homePage.topCategories.id(categoryId);

    if (!category) {
      return res.status(404).json({ message: 'Top category not found' });
    }

    if (name !== undefined) category.name = name;
    if (isActive !== undefined) category.isActive = isActive;

    await homePage.save();

    res.status(200).json({ message: 'Top category updated successfully', topCategories: homePage.topCategories });
  } catch (error) {
    res.status(500).json({ message: 'Error updating top category', error: error.message });
  }
};

// Remove a top category
exports.removeTopCategory = async (req, res) => {
  const { categoryId } = req.params;

  try {
    const homePage = await HomePage.findOne();

    if (!homePage) {
      return res.status(404).json({ message: 'Home page not found' });
    }

    homePage.topCategories = homePage.topCategories.filter(category => category._id.toString() !== categoryId);
    await homePage.save();

    res.status(200).json({ message: 'Top category removed successfully', topCategories: homePage.topCategories });
  } catch (error) {
    res.status(500).json({ message: 'Error removing top category', error: error.message });
  }
};

// Add products to "Best Selling" section
exports.addBestSellingProducts = async (req, res) => {
  const { productIds } = req.body;

  try {
    let homePage = await HomePage.findOne();

    if (!homePage) {
      homePage = new HomePage();
    }

    homePage.bestSellingProducts = productIds;
    await homePage.save();

    res.status(201).json({ message: 'Best selling products updated successfully', bestSellingProducts: homePage.bestSellingProducts });
  } catch (error) {
    res.status(500).json({ message: 'Error updating best selling products', error: error.message });
  }
};

exports.removeBestSellingProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const homePage = await HomePage.findOne();

    if (!homePage) {
      return res.status(404).json({ message: 'Home page not found' });
    }

    homePage.bestSellingProducts = homePage.bestSellingProducts.filter(product => product._id.toString() !== productId);
    await homePage.save();

    res.status(200).json({ message: 'Best selling product removed successfully', bestSellingProducts: homePage.bestSellingProducts });
  } catch (error) {
    res.status(500).json({ message: 'Error removing best selling product', error: error.message });
  }
};

// Get all top categories
exports.getTopCategories = async (req, res) => {
  try {
    const homePage = await HomePage.findOne().populate('topCategories.categoryId');

    if (!homePage) {
      return res.status(404).json({ message: 'Home page not found' });
    }

    res.status(200).json({ topCategories: homePage.topCategories });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching top categories', error: error.message });
  }
};

// Get all best-selling products
exports.getBestSellingProducts = async (req, res) => {
  try {
    const homePage = await HomePage.findOne().populate('bestSellingProducts');

    if (!homePage) {
      return res.status(404).json({ message: 'Home page not found' });
    }

    res.status(200).json({ bestSellingProducts: homePage.bestSellingProducts });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching best-selling products', error: error.message });
  }
};

