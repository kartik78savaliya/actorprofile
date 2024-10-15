import mongoose, { Schema } from "mongoose";

const profileSchema = new Schema({
  id: {
    type: String,
    default: function () {
      return this._id.toString();
    }
  },
  actorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Actor'
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    required: true
  },
  actingExperience: {
    type: String,
    required: true
  },
  profilePicture: {
    type: String,
  },
  profilePicturePublicId: {
    type: String,
  },
  video: {
    type: String,
  },
  videoPublicId: {
    type: String,
  },
  profileType: {
    type: String,
  },
  castingType: {
    type: String,
  },
  unionMember: {
    type: Boolean,
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role'
  },
}, {
  timestamps: true
}
);

export const dbProfile = mongoose.model("Profile", profileSchema);
