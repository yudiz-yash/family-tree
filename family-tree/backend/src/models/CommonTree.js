const mongoose = require('mongoose');

const nodeSchema = new mongoose.Schema(
  {
    nodeId:     { type: String, required: true },
    name:       { type: String, required: true, trim: true },
    nickname:   { type: String, trim: true, default: '' },
    gender:     { type: String, enum: ['male', 'female', 'other'], default: 'male' },
    parentId:   { type: String, default: null },
    dateOfBirth:{ type: String, default: '' }
  },
  { _id: false }
);

// Only one document ever exists — singleton pattern via a fixed key
const commonTreeSchema = new mongoose.Schema(
  { nodes: [nodeSchema] },
  { timestamps: true }
);

module.exports = mongoose.model('CommonTree', commonTreeSchema);
