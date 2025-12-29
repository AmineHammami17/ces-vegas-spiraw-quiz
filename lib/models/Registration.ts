import mongoose, { Schema, model, models } from 'mongoose';

export interface IRegistration {
  _id?: string;
  name: string;
  email: string;
  session_id: string;
  created_at?: Date;
}

const RegistrationSchema = new Schema<IRegistration>(
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
    session_id: {
      type: String,
      required: true,
      unique: true,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

RegistrationSchema.index({ email: 1 });
RegistrationSchema.index({ session_id: 1 });

export const Registration =
  models.Registration || model<IRegistration>('Registration', RegistrationSchema);


