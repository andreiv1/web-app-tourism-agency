const Joi = require("joi");

const tripSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(10).max(1000).required(),
  startDate: Joi.date().required(),
  endDate: Joi.date(),
  departure: Joi.string().min(3).max(15).required(),
  destinations: Joi.array().items(Joi.string().min(3).max(50)).required(),
  minParticipants: Joi.number().integer().min(1).required(),
  maxParticipants: Joi.number().integer().min(1).required(),
  price: Joi.number().min(0).required(),
  currency: Joi.string().valid("RON", "EUR").required(),
  transport: Joi.array().items(Joi.string().valid("bus", "plane", "ship")),
  itinerary: Joi.object().pattern(
    Joi.date().iso(),
    Joi.object({
      title: Joi.string().min(3).max(100).required(),
      description: Joi.string().min(10).max(1000),
      objectives: Joi.array().items(Joi.string().min(3).max(50)),
    })
  ).required(),
  imageUri: Joi.string().dataUri().optional(),
});

const tripUpdateSchema = Joi.object({
  title: Joi.string().min(3).max(100).optional(),
  description: Joi.string().min(10).max(1000).optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  departure: Joi.string().min(3).max(15).optional(),
  destinations: Joi.array().items(Joi.string().min(3).max(50)).optional(),
  minParticipants: Joi.number().integer().min(1).optional(),
  maxParticipants: Joi.number().integer().min(1).optional(),
  price: Joi.number().min(0).optional(),
  currency: Joi.string().valid("RON", "EUR").optional(),
  transport: Joi.array().items(Joi.string().valid("bus", "plane", "ship")).optional(),
  itinerary: Joi.object().pattern(
    Joi.date().iso(),
    Joi.object({
      title: Joi.string().min(3).max(100).required(),
      description: Joi.string().min(10).max(1000),
      objectives: Joi.array().items(Joi.string().min(3).max(50)),
    })
  ),
  imageUri: Joi.string().dataUri().optional(),
});

module.exports = { tripSchema, tripUpdateSchema };
