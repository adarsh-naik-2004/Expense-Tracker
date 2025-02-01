import Expense from '../models/Expense.js';

export const createExpense = async (req, res) => {
  try {
    const { amount, category, date, description } = req.body;
    
    if (!req.user?.id) {
      console.log("❌ No user ID in request:", req.user);
      return res.status(401).json({ message: "User ID not found" });
    }

    console.log("Creating expense for user:", req.user.id);
    
    const expense = await Expense.create({
      user: req.user.id,
      amount,
      category,
      date: date || Date.now(),
      description
    });

    console.log("✅ Expense created:", expense);
    
    res.status(201).json(expense);
  } catch (error) {
    console.error("❌ Error creating expense:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getExpenses = async (req, res) => {
  try {
    console.log('Entering getExpenses controller');
    const { page = 1, limit = 10 } = req.query;
    console.log(`Received params - page: ${page}, limit: ${limit}`);
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    console.log(`Calculated skip: ${skip}`);

    const filter = { user: req.user.id };
    console.log('Filter:', filter);

    const [expenses, count] = await Promise.all([
      Expense.find(filter)
        .skip(skip)
        .limit(parseInt(limit))
        .sort('-date')
        .lean(),
      Expense.countDocuments(filter)
    ]);
    console.log(`Found ${expenses.length} expenses, total: ${count}`);

    res.json({
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      expenses
    });
  } catch (error) {
    console.error('Error in getExpenses:', error);
    res.status(500).json({ message: 'Server error while fetching expenses', error: error.message });
  }
};

export const getInsights = async (req, res) => {
  try {
    const insights = await Expense.aggregate([
      { $match: { user: req.user.id } },
      {
        $group: {
          _id: '$category',
          total: { $sum: { $toDouble: "$amount" } }, // Ensure numeric conversion
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          category: '$_id',
          total: 1,
          percentage: {
            $multiply: [
              { $divide: ['$total', { $sum: '$total' }] },
              100
            ]
          }
        }
      }
    ]);

    // Ensure numeric values
    const processedInsights = insights.map(item => ({
      ...item,
      total: Number(item.total.toFixed(2))
    }));

    res.json(processedInsights);
  } catch (error) {
    console.error("Insights error:", error);
    res.status(500).json({ 
      message: 'Error generating insights',
      error: error.message
    });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};