import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { isDBConnected } from '../config/db.js';

// In-Memory user repository for zero-config fallback
const memoryUserStore = new Map();

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    chefTitle: {
      type: String,
      default: 'Executive Home Chef',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const MongooseUser = mongoose.model('User', userSchema);

export const UserRepository = {
  async findByEmail(email) {
    const cleanEmail = email.toLowerCase().trim();
    if (isDBConnected()) {
      return await MongooseUser.findOne({ email: cleanEmail });
    }
    return Array.from(memoryUserStore.values()).find(
      (u) => u.email.toLowerCase() === cleanEmail
    ) || null;
  },

  async findById(id) {
    if (isDBConnected()) {
      return await MongooseUser.findById(id).select('-password');
    }
    const user = memoryUserStore.get(id);
    if (!user) return null;
    const { password, ...safeUser } = user;
    return safeUser;
  },

  async create(data) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const cleanEmail = data.email.toLowerCase().trim();

    if (isDBConnected()) {
      const user = await MongooseUser.create({
        name: data.name.trim(),
        email: cleanEmail,
        password: data.password, // Schema pre-save hooks hash this
        chefTitle: data.chefTitle || 'Executive Home Chef',
      });
      return user;
    }

    const id = uuidv4();
    const newUser = {
      _id: id,
      id: id,
      name: data.name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      chefTitle: data.chefTitle || 'Executive Home Chef',
      createdAt: new Date().toISOString(),
      async comparePassword(candidatePassword) {
        return await bcrypt.compare(candidatePassword, this.password);
      },
    };
    memoryUserStore.set(id, newUser);
    return newUser;
  },
};

export default MongooseUser;
