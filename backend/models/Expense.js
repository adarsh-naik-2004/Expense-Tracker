import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  user: {
    required: [true, 'User ID is required'],
    type: mongoose.Schema.Types.ObjectId,
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount must be greater than 0']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['food', 'transport', 'housing', 'entertainment', 'other'],
      message: '{VALUE} is not a valid category'
    }
  },
  date: {
    type: Date,
    default: Date.now,
    validate: {
      validator: function(v) {
        return v instanceof Date && !isNaN(v);
      },
      message: 'Invalid date format'
    }
  },
  description: {
    type: String,
    trim: true,
    maxLength: [500, 'Description cannot be more than 500 characters']
  }
}, { timestamps: true });

export default mongoose.model('Expense', expenseSchema);