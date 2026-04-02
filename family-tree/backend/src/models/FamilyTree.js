const mongoose = require('mongoose');

const nodeSchema = new mongoose.Schema(
  {
    nodeId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    nickname: {
      type: String,
      trim: true,
      default: ''
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      default: 'male'
    },
    parentId: {
      type: String,
      default: null
    }
  },
  { _id: false }
);

const familyTreeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    nodes: [nodeSchema]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.models.FamilyTree || mongoose.model('FamilyTree', familyTreeSchema);
