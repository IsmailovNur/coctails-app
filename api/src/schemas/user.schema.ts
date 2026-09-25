import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { Role } from '../types.js';
import bcrypt from 'bcrypt';
import { randomUUID } from 'node:crypto';
import type { Document } from 'mongoose';

export type UserDocument = User & Document;
const SALT_WORK_FACTOR = 10;

@Schema()
export class User {
  @Prop({
    required: true,
    unique: true,
    trim: true,
  })
  username: string;

  @Prop({
    required: true,
    trim: true,
  })
  displayName: string;

  @Prop({
    required: true,
    unique: true,
    trim: true,
  })
  email: string;

  @Prop({
    required: true,
    trim: true,
  })
  avatar: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    required: true,
    enum: ['user', 'admin'],
    default: 'user',
  })
  role: Role;

  @Prop({ required: true })
  token: string;

  @Prop({ type: String, default: null })
  googleId: string | null;

  checkPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  generateToken(): void {
    this.token = randomUUID();
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.set('toJSON', {
  transform: (_doc, ret: Partial<User>) => {
    delete ret.password;
    return ret;
  },
});

UserSchema.methods.generateToken = function () {
  this.token = randomUUID();
};

UserSchema.methods.checkPassword = function (password: string) {
  return bcrypt.compare(password, this.password);
};

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
  this.password = await bcrypt.hash(this.password, salt);
});
