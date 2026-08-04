import Participant from '../models/Participant.js';

export const registerParticipant = async (req, res) => {
  const participant = await Participant.create(req.body);
  res.status(201).json(participant);
};

export const getParticipants = async (req, res) => {
  const participants = await Participant.find().populate('category');
  res.json(participants);
};
