import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  senha: string;
  nome: string;
  cel?: string;
  nv_acesso?: string;
  acessos?: Record<string, boolean>;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  nome: String,
  cel: String,
  nv_acesso: String,
  acessos: Object
});

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
