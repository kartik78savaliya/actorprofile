import { dbActor } from "../models/actor.model.js"

export const findActorByEmail = async (email) => {
  return await dbActor.findOne({ email })
}

export const createActor = async (data) => {
  return await dbActor.create(data)
}

export const findActorById = async (actorId) => {
  return await dbActor.findById(actorId)
}

export const findActorByIdWithSelect = async (actorId, select) => {
  return await dbActor.findById(actorId).select(select).lean()
}

export const updateActorPassword = async (actorId, newPassword) => {
  const actor = await dbActor.findById(actorId)
  actor.password = newPassword
  await actor.save({ validateBeforeSave: false })
  return actor
}

export const generateAccessAndRefreshTokens = async (actorId) => {
  const actor = await dbActor.findById(actorId)
  const accessToken = actor.generateAccessToken()
  const refreshToken = actor.generateRefreshToken()
  actor.refreshToken = refreshToken
  await actor.save({ validateBeforeSave: false })
  return { accessToken, refreshToken }
}

export const verifyActorPassword = async (actorId, password) => {
  const actor = await findActorById(actorId)
  return await actor.isPasswordCorrect(password)
}

export const findActorByResetToken = async (token) => {
  return await dbActor.findOne({ resetToken: token })
}

export const updateActorDataById = async (actorId, data) => {
  return await dbActor.findByIdAndUpdate(actorId, data, { new: true, runValidators: false })
}

export const findActorByData = async (data) => {
  return await dbActor.findOne(data)
}