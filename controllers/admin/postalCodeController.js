const PostalCode = require('../../models/postalCodeModel');

// Create a new postal code
exports.createPostalCode = async (req, res) => {
  try {
    const { district, subordinate, branch, ZipCode } = req.body;
    const newPostalCode = new PostalCode({ district, subordinate, branch, ZipCode });
    await newPostalCode.save();
    
    res.status(201).json({ message: 'Postal Code created successfully.', postalCode: newPostalCode });
  } catch (error) {
    res.status(500).json({ message: 'Error creating postal code', error: error.message });
  }
};

// Get all postal codes
exports.getAllPostalCodes = async (req, res) => {
  try {
    const postalCodes = await PostalCode.find();
    res.status(200).json({ message: 'Postal Codes retrieved successfully.', postalCodes });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching postal codes', error: error.message });
  }
};

// Get postal codes by ZipCode
exports.getPostalCodesByZipCode = async (req, res) => {
  try {
    const { ZipCode } = req.params;
    const postalCodes = await PostalCode.find({ ZipCode });
    
    if (!postalCodes.length) {
      return res.status(404).json({ message: 'No postal codes found for this ZipCode' });
    }
    
    res.status(200).json({ message: 'Postal Codes retrieved successfully.', postalCodes });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching postal codes', error: error.message });
  }
};

// Get postal codes by branch
exports.getPostalCodesByBranch = async (req, res) => {
  try {
    const { branch } = req.params;
    const postalCodes = await PostalCode.find({ branch: new RegExp(branch, 'i') });

    if (!postalCodes.length) {
      return res.status(404).json({ message: 'No postal codes found for this branch' });
    }

    res.status(200).json({ message: 'Postal Codes retrieved successfully.', postalCodes });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching postal codes', error: error.message });
  }
};

// Get postal codes by subordinate
exports.getPostalCodesBySubordinate = async (req, res) => {
  try {
    const { subordinate } = req.params;
    const postalCodes = await PostalCode.find({ subordinate: new RegExp(subordinate, 'i') });

    if (!postalCodes.length) {
      return res.status(404).json({ message: 'No postal codes found for this subordinate' });
    }

    res.status(200).json({ message: 'Postal Codes retrieved successfully.', postalCodes });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching postal codes', error: error.message });
  }
};
