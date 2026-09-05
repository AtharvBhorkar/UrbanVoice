const Category = require('../models/Category');

const getCategories = async (req, res) => {
  try {
    const filter = req.query.all === 'true' ? {} : { isActive: true };
    const categories = await Category.find(filter).sort({ name: 1 });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, department, priorityWeight } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Category name zaroori hai' });
    }
    const existing = await Category.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({ message: 'Ye category naam pehle se exist karta hai' });
    }
    const category = await Category.create({
      name: name.trim(),
      department: department || 'General',
      priorityWeight: priorityWeight || 1,
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { name, department, priorityWeight, isActive } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category nahi mili' });
    }
    if (name && name.trim() !== category.name) {
      const existing = await Category.findOne({ name: name.trim() });
      if (existing) {
        return res.status(400).json({ message: 'Ye category naam pehle se exist karta hai' });
      }
      category.name = name.trim();
    }
    if (department) category.department = department;
    if (priorityWeight !== undefined) category.priorityWeight = priorityWeight;
    if (isActive !== undefined) category.isActive = isActive;
    await category.save();
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category nahi mili' });
    }
    await category.deleteOne();
    res.status(200).json({ message: 'Category delete ho gayi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };